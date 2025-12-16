import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { EntityManager } from "typeorm";
import { In, LessThan, Not } from "typeorm";

type DicomLevel = "instance" | "series" | "study";

interface DicomLevelConfig {
    entity: typeof InstanceEntity | typeof SeriesEntity | typeof StudyEntity;
    parentIdField?: "localSeriesId" | "localStudyId";
    childEntity?: typeof InstanceEntity | typeof SeriesEntity;
    childParentField?: "localSeriesId" | "localStudyId";
}

export class DicomDeleteService {
    private readonly entityManager: EntityManager;
    private readonly levelConfigs: Record<DicomLevel, DicomLevelConfig> = {
        instance: {
            entity: InstanceEntity,
            parentIdField: "localSeriesId",
        },
        series: {
            entity: SeriesEntity,
            parentIdField: "localStudyId",
            childEntity: InstanceEntity,
            childParentField: "localSeriesId",
        },
        study: {
            entity: StudyEntity,
            childEntity: SeriesEntity,
            childParentField: "localStudyId",
        },
    };

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async recycleInstances(workspaceId: string, instanceIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected, parentIds } =
                    await this.updateItemDeleteStatus(
                        workspaceId,
                        instanceIds,
                        DICOM_DELETE_STATUS.ACTIVE,
                        DICOM_DELETE_STATUS.RECYCLED,
                        "instance",
                        transactionalEntityManager,
                    );

                if (affected === 0 || !parentIds) return { affected: 0 };

                await this.recycleEmptySeries(
                    parentIds,
                    transactionalEntityManager,
                );

                return { affected };
            },
        );
    }

    async recycleSeries(workspaceId: string, seriesIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected, parentIds } =
                    await this.updateItemDeleteStatus(
                        workspaceId,
                        seriesIds,
                        DICOM_DELETE_STATUS.ACTIVE,
                        DICOM_DELETE_STATUS.RECYCLED,
                        "series",
                        transactionalEntityManager,
                    );

                if (affected === 0 || !parentIds) return { affected: 0 };

                await this.cascadeUpdateChildren(
                    seriesIds,
                    DICOM_DELETE_STATUS.ACTIVE,
                    DICOM_DELETE_STATUS.RECYCLED,
                    "series",
                    transactionalEntityManager,
                );

                await this.recycleEmptyStudies(
                    parentIds,
                    transactionalEntityManager,
                );

                return { affected };
            },
        );
    }

    async recycleStudies(workspaceId: string, studyIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    studyIds,
                    DICOM_DELETE_STATUS.ACTIVE,
                    DICOM_DELETE_STATUS.RECYCLED,
                    "study",
                    transactionalEntityManager,
                );

                if (affected === 0) return { affected: 0 };

                await this.cascadeUpdateChildren(
                    studyIds,
                    DICOM_DELETE_STATUS.ACTIVE,
                    DICOM_DELETE_STATUS.RECYCLED,
                    "study",
                    transactionalEntityManager,
                );

                const seriesIds = await transactionalEntityManager
                    .find(SeriesEntity, {
                        where: {
                            localStudyId: In(studyIds),
                        },
                        select: {
                            id: true,
                        },
                    })
                    .then((series) => series.map((series) => series.id));

                if (seriesIds.length > 0) {
                    await this.cascadeUpdateChildren(
                        seriesIds,
                        DICOM_DELETE_STATUS.ACTIVE,
                        DICOM_DELETE_STATUS.RECYCLED,
                        "series",
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    async restoreInstances(
        workspaceId: string,
        instanceIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        const em = transactionalEntityManager ?? this.entityManager;

        const { affected } = await this.updateItemDeleteStatus(
            workspaceId,
            instanceIds,
            DICOM_DELETE_STATUS.RECYCLED,
            DICOM_DELETE_STATUS.ACTIVE,
            "instance",
            transactionalEntityManager,
        );

        if (affected > 0) {
            const instances = await em.find(InstanceEntity, {
                where: {
                    id: In(instanceIds),
                },
                select: {
                    localSeriesId: true,
                },
            });

            const seriesIds = instances.map(
                (instance) => instance.localSeriesId,
            );
            await this.restoreActiveSeries(seriesIds, em);
        }

        return { affected };
    }

    async restoreSeries(workspaceId: string, seriesIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    seriesIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.ACTIVE,
                    "series",
                    transactionalEntityManager,
                );

                if (affected > 0) {
                    await this.cascadeUpdateChildren(
                        seriesIds,
                        DICOM_DELETE_STATUS.RECYCLED,
                        DICOM_DELETE_STATUS.ACTIVE,
                        "series",
                        transactionalEntityManager,
                    );

                    const series = await transactionalEntityManager.find(
                        SeriesEntity,
                        {
                            where: { id: In(seriesIds) },
                            select: { localStudyId: true },
                        },
                    );

                    await this.restoreActiveStudies(
                        [...new Set(series.map((s) => s.localStudyId))],
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    async restoreStudies(workspaceId: string, studyIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    studyIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.ACTIVE,
                    "study",
                    transactionalEntityManager,
                );

                if (affected > 0) {
                    const seriesIds = await transactionalEntityManager
                        .find(SeriesEntity, {
                            where: { localStudyId: In(studyIds) },
                            select: { id: true },
                        })
                        .then((series) => series.map((s) => s.id));

                    if (seriesIds.length > 0) {
                        await this.cascadeUpdateChildren(
                            studyIds,
                            DICOM_DELETE_STATUS.RECYCLED,
                            DICOM_DELETE_STATUS.ACTIVE,
                            "study",
                            transactionalEntityManager,
                        );

                        await this.cascadeUpdateChildren(
                            seriesIds,
                            DICOM_DELETE_STATUS.RECYCLED,
                            DICOM_DELETE_STATUS.ACTIVE,
                            "series",
                            transactionalEntityManager,
                        );
                    }
                }

                return { affected };
            },
        );
    }

    async undeleteInstances(
        workspaceId: string,
        instanceIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        const em = transactionalEntityManager ?? this.entityManager;

        const { affected } = await this.updateItemDeleteStatus(
            workspaceId,
            instanceIds,
            DICOM_DELETE_STATUS.DELETED,
            DICOM_DELETE_STATUS.ACTIVE,
            "instance",
            em,
        );

        if (affected > 0) {
            const instances = await em.find(InstanceEntity, {
                where: {
                    id: In(instanceIds),
                },
                select: {
                    localSeriesId: true,
                },
            });

            const seriesIds = [
                ...new Set(instances.map((i) => i.localSeriesId)),
            ];

            await this.undeleteActiveSeries(seriesIds, em);
        }

        return { affected };
    }

    async undeleteSeries(workspaceId: string, seriesIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    seriesIds,
                    DICOM_DELETE_STATUS.DELETED,
                    DICOM_DELETE_STATUS.ACTIVE,
                    "series",
                    transactionalEntityManager,
                );

                if (affected > 0) {
                    await this.cascadeUpdateChildren(
                        seriesIds,
                        DICOM_DELETE_STATUS.DELETED,
                        DICOM_DELETE_STATUS.ACTIVE,
                        "series",
                        transactionalEntityManager,
                    );

                    const series = await transactionalEntityManager.find(
                        SeriesEntity,
                        {
                            where: { id: In(seriesIds) },
                            select: { localStudyId: true },
                        },
                    );

                    const studyIds = [
                        ...new Set(series.map((s) => s.localStudyId)),
                    ];

                    await this.undeleteActiveStudies(
                        studyIds,
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    async undeleteStudies(workspaceId: string, studyIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    studyIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.ACTIVE,
                    "study",
                    transactionalEntityManager,
                );

                if (affected > 0) {
                    const seriesIds = await transactionalEntityManager
                        .find(SeriesEntity, {
                            where: { localStudyId: In(studyIds) },
                            select: { id: true },
                        })
                        .then((series) => series.map((s) => s.id));

                    if (seriesIds.length > 0) {
                        await this.cascadeUpdateChildren(
                            studyIds,
                            DICOM_DELETE_STATUS.RECYCLED,
                            DICOM_DELETE_STATUS.ACTIVE,
                            "study",
                            transactionalEntityManager,
                        );

                        await this.cascadeUpdateChildren(
                            seriesIds,
                            DICOM_DELETE_STATUS.RECYCLED,
                            DICOM_DELETE_STATUS.ACTIVE,
                            "series",
                            transactionalEntityManager,
                        );
                    }
                }
            },
        );
    }

    async permanentlyDeleteMarkedItems(workspaceId: string, beforeDate: Date) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const instancesToDelete = await transactionalEntityManager.find(
                    InstanceEntity,
                    {
                        where: {
                            workspaceId,
                            deleteStatus: DICOM_DELETE_STATUS.DELETED,
                            deletedAt: LessThan(beforeDate),
                        },
                        select: {
                            id: true,
                            instancePath: true,
                            localSeriesId: true,
                        },
                    },
                );

                if (instancesToDelete.length > 0) {
                    await transactionalEntityManager.delete(InstanceEntity, {
                        id: In(
                            instancesToDelete.map((instance) => instance.id),
                        ),
                    });

                    const seriesIds = [
                        ...new Set(
                            instancesToDelete.map(
                                (instance) => instance.localSeriesId,
                            ),
                        ),
                    ];
                    await this.cleanupEmptySeries(
                        seriesIds,
                        transactionalEntityManager,
                    );
                }

                return {
                    deletedInstances: instancesToDelete.length,
                    instancePaths: instancesToDelete.map(
                        (instance) => instance.instancePath,
                    ),
                };
            },
        );
    }

    private async recycleEmptySeries(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        // 批量查詢每個 series 的 active instance
        const activeInstanceCounts = await em
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.localSeriesId", "seriesId")
            .addSelect("COUNT(*)", "count")
            .where("instance.localSeriesId IN (:...seriesIds)", { seriesIds })
            .andWhere("instance.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("instance.localSeriesId")
            .getRawMany<{ seriesId: string; count: number }>();

        const seriesWithActiveInstances = new Set(
            activeInstanceCounts.map((c) => c.seriesId),
        );

        const emptySeriesIds = uniqueSeriesIds.filter(
            (id) => !seriesWithActiveInstances.has(id),
        );

        if (emptySeriesIds.length === 0) return;

        const seriesToRecycle = await em.find(SeriesEntity, {
            where: {
                id: In(emptySeriesIds),
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            },
            select: {
                id: true,
                localStudyId: true,
                deleteStatus: true,
            },
        });

        if (seriesToRecycle.length === 0) return;

        await em.update(
            SeriesEntity,
            {
                id: In(seriesToRecycle.map((s) => s.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                deletedAt: new Date(),
            },
        );

        // 獲取受影響的 study IDs
        const affectedStudyIds = [
            ...new Set(seriesToRecycle.map((s) => s.localStudyId)),
        ];

        await this.recycleEmptyStudies(affectedStudyIds, em);
    }

    private async recycleEmptyStudies(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        const activeSeriesCounts = await em
            .createQueryBuilder(SeriesEntity, "series")
            .select("series.localStudyId", "studyId")
            .addSelect("COUNT(*)", "count")
            .where("series.localStudyId IN (:...studyIds)", { studyIds })
            .andWhere("series.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("series.localStudyId")
            .getRawMany<{ studyId: string; count: number }>();

        const studyWithActiveSeries = new Set(
            activeSeriesCounts.map((c) => c.studyId),
        );

        const emptyStudyIds = uniqueStudyIds.filter(
            (id) => !studyWithActiveSeries.has(id),
        );

        if (emptyStudyIds.length === 0) return;

        const studiesToRecycle = await em.find(StudyEntity, {
            where: {
                id: In(emptyStudyIds),
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            },
            select: {
                id: true,
                deleteStatus: true,
            },
        });

        if (studiesToRecycle.length === 0) return;

        await em.update(
            StudyEntity,
            {
                id: In(studiesToRecycle.map((s) => s.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                deletedAt: new Date(),
            },
        );
    }

    private async restoreActiveSeries(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        const activeInstanceCounts = await em
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.localSeriesId", "seriesId")
            .addSelect("COUNT(*)", "count")
            .where("instance.localSeriesId IN (:...seriesIds)", { seriesIds })
            .andWhere("instance.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("instance.localSeriesId")
            .getRawMany<{ seriesId: string; count: number }>();

        const seriesWithActiveInstances = new Set(
            activeInstanceCounts.map((c) => c.seriesId),
        );

        const activeSeriesIds = uniqueSeriesIds.filter((id) =>
            seriesWithActiveInstances.has(id),
        );

        if (activeSeriesIds.length === 0) return;

        const seriesToRestore = await em.find(SeriesEntity, {
            where: {
                id: In(activeSeriesIds),
                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            },
            select: {
                id: true,
                localStudyId: true,
                deleteStatus: true,
            },
        });

        if (seriesToRestore.length === 0) return;

        await em.update(
            SeriesEntity,
            {
                id: In(seriesToRestore.map((s) => s.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                deletedAt: null,
            },
        );

        const affectedStudyIds = [
            ...new Set(seriesToRestore.map((s) => s.localStudyId)),
        ];
        await this.restoreActiveStudies(affectedStudyIds, em);
    }

    private async restoreActiveStudies(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        const seriesCounts = await em
            .createQueryBuilder(SeriesEntity, "series")
            .select("series.localStudyId", "studyId")
            .addSelect("COUNT(*)", "count")
            .where("series.localStudyId IN (:...studyIds)", { studyIds })
            .andWhere("series.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("series.localStudyId")
            .getRawMany<{ studyId: string; count: number }>();

        const studiesWithSeries = new Set(seriesCounts.map((c) => c.studyId));

        const activeStudyIds = uniqueStudyIds.filter((id) =>
            studiesWithSeries.has(id),
        );

        if (activeStudyIds.length === 0) return;

        await em.update(
            StudyEntity,
            {
                id: In(activeStudyIds),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                deletedAt: null,
            },
        );
    }

    private async undeleteActiveSeries(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        const activeInstanceCounts = await em
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.localSeriesId", "seriesId")
            .addSelect("COUNT(*)", "count")
            .where("instance.localSeriesId IN (:...seriesIds)", {
                seriesIds: uniqueSeriesIds,
            })
            .andWhere("instance.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("instance.localSeriesId")
            .getRawMany<{ seriesId: string; count: number }>();

        const seriesWithActiveInstances = new Set(
            activeInstanceCounts.map((c) => c.seriesId),
        );

        const activeSeriesIds = seriesIds.filter((id) =>
            seriesWithActiveInstances.has(id),
        );

        if (activeSeriesIds.length === 0) return;

        const seriesToUndelete = await em.find(SeriesEntity, {
            where: {
                id: In(activeSeriesIds),
                deleteStatus: DICOM_DELETE_STATUS.DELETED,
            },
            select: {
                id: true,
                localStudyId: true,
                deleteStatus: true,
            },
        });

        if (seriesToUndelete.length === 0) return;

        await em.update(
            SeriesEntity,
            {
                id: In(seriesToUndelete.map((s) => s.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                deletedAt: null,
            },
        );
    }

    private async undeleteActiveStudies(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        const activeSeriesCounts = await em
            .createQueryBuilder(SeriesEntity, "series")
            .select("series.localStudyId", "studyId")
            .addSelect("COUNT(*)", "count")
            .where("series.localStudyId IN (:...studyIds)", {
                studyIds: uniqueStudyIds,
            })
            .andWhere("series.deleteStatus = :deleteStatus", {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            })
            .groupBy("series.localStudyId")
            .getRawMany<{ studyId: string; count: number }>();

        const studiesWithActiveSeries = new Set(
            activeSeriesCounts.map((c) => c.studyId),
        );

        const activeStudyIds = studyIds.filter((id) =>
            studiesWithActiveSeries.has(id),
        );

        if (activeStudyIds.length === 0) return;

        const studiesToUndelete = await em.find(StudyEntity, {
            where: {
                id: In(activeStudyIds),
                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            },
            select: {
                id: true,
                deleteStatus: true,
            },
        });

        if (studiesToUndelete.length === 0) return;

        await em.update(
            StudyEntity,
            {
                id: In(studiesToUndelete.map((s) => s.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                deletedAt: null,
            },
        );
    }

    private async cleanupEmptySeries(
        seriesIds: string[],
        transactionalEntityManager: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const instanceCounts = await transactionalEntityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.localSeriesId", "seriesId")
            .addSelect("COUNT(*)", "count")
            .where("instance.localSeriesId IN (:...seriesIds)", { seriesIds })
            .groupBy("instance.localSeriesId")
            .getRawMany<{ seriesId: string; count: number }>();

        const seriesWithInstances = new Set(
            instanceCounts.map((c) => c.seriesId),
        );

        const emptySeriesIds = seriesIds.filter(
            (id) => !seriesWithInstances.has(id),
        );

        if (emptySeriesIds.length === 0) return;

        const seriesToDelete = await transactionalEntityManager.find(
            SeriesEntity,
            {
                where: {
                    id: In(emptySeriesIds),
                    deleteStatus: DICOM_DELETE_STATUS.DELETED,
                },
                select: {
                    id: true,
                    localStudyId: true,
                    deleteStatus: true,
                },
            },
        );

        if (seriesToDelete.length === 0) return;

        await transactionalEntityManager.delete(SeriesEntity, {
            id: In(seriesToDelete.map((s) => s.id)),
        });

        const affectedStudyIds = [
            ...new Set(seriesToDelete.map((s) => s.localStudyId)),
        ];

        for (const studyId of affectedStudyIds) {
            await this.cleanupEmptyStudies(studyId, transactionalEntityManager);
        }
    }

    private async cleanupEmptyStudies(
        studyId: string,
        transactionalEntityManager: EntityManager,
    ) {
        const seriesCount = await transactionalEntityManager.count(
            SeriesEntity,
            {
                where: {
                    localStudyId: studyId,
                },
            },
        );

        if (seriesCount === 0) {
            await transactionalEntityManager.delete(StudyEntity, {
                id: studyId,
            });
        }
    }

    async markRecycledItemsForDeletion(workspaceId: string, beforeDate: Date) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const instancesToMark = await transactionalEntityManager.find(
                    InstanceEntity,
                    {
                        where: {
                            workspaceId,
                            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            deletedAt: LessThan(beforeDate),
                        },
                        select: {
                            id: true,
                            localSeriesId: true,
                        },
                    },
                );

                if (instancesToMark.length === 0) {
                    return {
                        markedInstances: 0,
                        markedSeries: 0,
                        markedStudies: 0,
                    };
                }

                await transactionalEntityManager.update(
                    InstanceEntity,
                    {
                        id: In(instancesToMark.map((instance) => instance.id)),
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.DELETED,
                        deletedAt: new Date(),
                    },
                );

                const seriesIds = [
                    ...new Set(
                        instancesToMark.map(
                            (instance) => instance.localSeriesId,
                        ),
                    ),
                ];

                const markedSeriesIds = await this.markEmptySeriesAsDeleted(
                    seriesIds,
                    transactionalEntityManager,
                );

                const markedStudyIds = await this.markEmptyStudiesAsDeleted(
                    markedSeriesIds,
                    transactionalEntityManager,
                );

                return {
                    markedInstances: instancesToMark.length,
                    markedSeries: markedSeriesIds.length,
                    markedStudies: markedStudyIds.length,
                };
            },
        );
    }

    private async markEmptySeriesAsDeleted(
        seriesIds: string[],
        transactionalEntityManager: EntityManager,
    ) {
        const seriesWithCounts = await transactionalEntityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.localSeriesId", "seriesId")
            .addSelect("COUNT(*)", "count")
            .where("instance.localSeriesId IN (:...seriesIds)", { seriesIds })
            .andWhere("instance.deleteStatus IN (:...deleteStatus)", {
                deleteStatus: [
                    DICOM_DELETE_STATUS.ACTIVE,
                    DICOM_DELETE_STATUS.RECYCLED,
                ],
            })
            .groupBy("instance.localSeriesId")
            .getRawMany();

        const seriesWithActiveInstances = new Set(
            seriesWithCounts.map((row) => row.seriesId),
        );

        const emptySeriesIds = seriesIds.filter(
            (id) => !seriesWithActiveInstances.has(id),
        );

        if (emptySeriesIds.length === 0) return [];

        const seriesToMark = await transactionalEntityManager.find(
            SeriesEntity,
            {
                where: {
                    id: In(emptySeriesIds),
                    deleteStatus: Not(DICOM_DELETE_STATUS.DELETED),
                },
                select: {
                    id: true,
                    deleteStatus: true,
                    localStudyId: true,
                },
            },
        );

        if (seriesToMark.length === 0) return [];

        await transactionalEntityManager.update(
            SeriesEntity,
            {
                id: In(seriesToMark.map((series) => series.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.DELETED,
                deletedAt: new Date(),
            },
        );

        return seriesToMark.map((series) => series.id);
    }

    private async markEmptyStudiesAsDeleted(
        markedSeriesIds: string[],
        transactionalEntityManager: EntityManager,
    ) {
        if (markedSeriesIds.length === 0) return [];

        const series = await transactionalEntityManager.find(SeriesEntity, {
            where: {
                id: In(markedSeriesIds),
            },
            select: {
                localStudyId: true,
            },
        });

        const studyIds = [...new Set(series.map((s) => s.localStudyId))];

        const studiesWithCounts = await transactionalEntityManager
            .createQueryBuilder(SeriesEntity, "series")
            .select("series.localStudyId", "studyId")
            .addSelect("COUNT(*)", "count")
            .where("series.localStudyId IN (:...studyIds)", { studyIds })
            .andWhere("series.deleteStatus IN (:...deleteStatus)", {
                deleteStatus: [
                    DICOM_DELETE_STATUS.ACTIVE,
                    DICOM_DELETE_STATUS.RECYCLED,
                ],
            })
            .groupBy("series.localStudyId")
            .getRawMany();

        const studiesWithActiveSeries = new Set(
            studiesWithCounts.map((row) => row.studyId),
        );

        const emptyStudyIds = studyIds.filter(
            (id) => !studiesWithActiveSeries.has(id),
        );

        if (emptyStudyIds.length === 0) return [];

        const studiesToMark = await transactionalEntityManager.find(
            StudyEntity,
            {
                where: {
                    id: In(emptyStudyIds),
                    deleteStatus: Not(DICOM_DELETE_STATUS.DELETED),
                },
                select: {
                    id: true,
                    deleteStatus: true,
                },
            },
        );

        if (studiesToMark.length === 0) return [];

        await transactionalEntityManager.update(
            StudyEntity,
            {
                id: In(studiesToMark.map((study) => study.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.DELETED,
                deletedAt: new Date(),
            },
        );

        return studiesToMark.map((study) => study.id);
    }

    async reactivateInstancesOnUpload(
        workspaceId: string,
        instanceIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        const em = transactionalEntityManager ?? this.entityManager;

        const instancesToReactivate = await em.find(InstanceEntity, {
            where: {
                id: In(instanceIds),
                workspaceId,
                deleteStatus: Not(DICOM_DELETE_STATUS.ACTIVE),
            },
            select: {
                id: true,
                localSeriesId: true,
                deleteStatus: true,
            },
        });

        if (instancesToReactivate.length === 0) return { affected: 0 };

        await em.update(
            InstanceEntity,
            {
                id: In(instancesToReactivate.map((instance) => instance.id)),
            },
            {
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                deletedAt: null,
            },
        );

        const seriesIds = [
            ...new Set(
                instancesToReactivate.map((instance) => instance.localSeriesId),
            ),
        ];

        await this.restoreActiveSeries(seriesIds, em);

        return { affected: instancesToReactivate.length };
    }

    async deleteInstances(workspaceId: string, instanceIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected, parentIds } =
                    await this.updateItemDeleteStatus(
                        workspaceId,
                        instanceIds,
                        DICOM_DELETE_STATUS.RECYCLED,
                        DICOM_DELETE_STATUS.DELETED,
                        "instance",
                        transactionalEntityManager,
                    );

                if (affected === 0 || !parentIds) return { affected: 0 };

                const markedSeriesIds = await this.markEmptySeriesAsDeleted(
                    parentIds,
                    transactionalEntityManager,
                );

                if (markedSeriesIds.length > 0) {
                    await this.markEmptyStudiesAsDeleted(
                        markedSeriesIds,
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    async deleteSeries(workspaceId: string, seriesIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected, parentIds } =
                    await this.updateItemDeleteStatus(
                        workspaceId,
                        seriesIds,
                        DICOM_DELETE_STATUS.RECYCLED,
                        DICOM_DELETE_STATUS.DELETED,
                        "series",
                        transactionalEntityManager,
                    );

                if (affected === 0) return { affected: 0 };

                await this.cascadeUpdateChildren(
                    seriesIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.DELETED,
                    "series",
                    transactionalEntityManager,
                );

                if (parentIds) {
                    await this.markEmptyStudiesAsDeleted(
                        seriesIds,
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    async deleteStudies(workspaceId: string, studyIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const { affected } = await this.updateItemDeleteStatus(
                    workspaceId,
                    studyIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.DELETED,
                    "study",
                    transactionalEntityManager,
                );

                if (affected === 0) return { affected: 0 };

                await this.cascadeUpdateChildren(
                    studyIds,
                    DICOM_DELETE_STATUS.RECYCLED,
                    DICOM_DELETE_STATUS.DELETED,
                    "study",
                    transactionalEntityManager,
                );

                const seriesIds = await transactionalEntityManager
                    .find(SeriesEntity, {
                        where: { localStudyId: In(studyIds) },
                        select: { id: true },
                    })
                    .then((series) => series.map((s) => s.id));

                if (seriesIds.length > 0) {
                    await this.cascadeUpdateChildren(
                        seriesIds,
                        DICOM_DELETE_STATUS.RECYCLED,
                        DICOM_DELETE_STATUS.DELETED,
                        "series",
                        transactionalEntityManager,
                    );
                }

                return { affected };
            },
        );
    }

    private async updateItemDeleteStatus(
        workspaceId: string,
        itemIds: string[],
        fromStatus: number,
        toStatus: number,
        dicomLevel: DicomLevel,
        transactionalEntityManager?: EntityManager,
    ): Promise<{ affected: number; parentIds?: string[] }> {
        const em = transactionalEntityManager ?? this.entityManager;
        const config = this.levelConfigs[dicomLevel];

        const items = await em.find(config.entity, {
            where: {
                id: In(itemIds),
                workspaceId,
                deleteStatus: fromStatus,
            },
            select: {
                id: true,
                ...(config.parentIdField
                    ? { [config.parentIdField]: true }
                    : {}),
            },
        });

        if (items.length === 0) return { affected: 0 };

        await em.update(
            config.entity,
            {
                id: In(items.map((item) => item.id)),
            },
            {
                deleteStatus: toStatus,
                deletedAt:
                    toStatus === DICOM_DELETE_STATUS.ACTIVE ? null : new Date(),
            },
        );

        const parentIds = config.parentIdField
            ? // @ts-expect-error - parentIdField is guaranteed to be a valid field on the entity
              [
                  ...new Set(
                      items.map((item) => (item as any)[config.parentIdField]),
                  ),
              ]
            : undefined;

        return { affected: items.length, parentIds };
    }

    private async cascadeUpdateChildren(
        parentIds: string[],
        fromStatus: number,
        toStatus: number,
        level: DicomLevel,
        transactionalEntityManager?: EntityManager,
    ) {
        const em = transactionalEntityManager ?? this.entityManager;
        const config = this.levelConfigs[level];

        if (!config.childEntity || !config.childParentField) return;

        await em.update(
            config.childEntity,
            {
                [config.childParentField]: In(parentIds),
                deleteStatus: fromStatus,
            },
            {
                deleteStatus: toStatus,
                deletedAt:
                    toStatus === DICOM_DELETE_STATUS.ACTIVE ? null : new Date(),
            },
        );
    }
}
