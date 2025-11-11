import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { EntityManager } from "typeorm";
import { In, LessThan } from "typeorm";

export class DicomDeleteService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async recycleInstances(workspaceId: string, instanceIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const instances = await transactionalEntityManager.find(
                    InstanceEntity,
                    {
                        where: {
                            id: In(instanceIds),
                            workspaceId,
                            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        },
                        select: {
                            id: true,
                            localSeriesId: true,
                        },
                    },
                );

                if (instances.length === 0) {
                    return { affected: 0 };
                }

                await transactionalEntityManager.update(
                    InstanceEntity,
                    { id: In(instances.map((instance) => instance.id)) },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        deletedAt: new Date(),
                    },
                );

                const seriesIds = [
                    ...new Set(
                        instances.map((instance) => instance.localSeriesId),
                    ),
                ];
                await this.updateSeriesInstanceCounts(
                    seriesIds,
                    transactionalEntityManager,
                );

                await this.recycleEmptySeries(
                    seriesIds,
                    transactionalEntityManager,
                );

                return {
                    affected: instances.length,
                };
            },
        );
    }

    async recycleSeries(workspaceId: string, seriesIds: string[]) {
        const series = await this.entityManager.find(SeriesEntity, {
            where: {
                id: In(seriesIds),
                workspaceId,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            },
            select: {
                id: true,
                localStudyId: true,
            },
        });

        if (series.length === 0) {
            return { affected: 0 };
        }

        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                await transactionalEntityManager.update(
                    SeriesEntity,
                    { id: In(series.map((series) => series.id)) },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        deletedAt: new Date(),
                    },
                );

                await transactionalEntityManager.update(
                    InstanceEntity,
                    {
                        localSeriesId: In(series.map((series) => series.id)),
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        deletedAt: new Date(),
                    },
                );

                const studyIds = series.map((series) => series.localStudyId);
                await this.updateStudySeriesCounts(
                    studyIds,
                    transactionalEntityManager,
                );

                await this.recycleEmptyStudies(
                    studyIds,
                    transactionalEntityManager,
                );

                return {
                    affected: series.length,
                };
            },
        );
    }

    async recycleStudies(workspaceId: string, studyIds: string[]) {
        const studies = await this.entityManager.find(StudyEntity, {
            where: {
                id: In(studyIds),
                workspaceId,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            },
            select: {
                id: true,
            },
        });

        if (studies.length === 0) {
            return { affected: 0 };
        }

        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                await transactionalEntityManager.update(
                    StudyEntity,
                    {
                        id: In(studies.map((study) => study.id)),
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        deletedAt: new Date(),
                    },
                );

                if (studies.length === 0) {
                    return {
                        affected: 0,
                    };
                }

                await transactionalEntityManager.update(
                    SeriesEntity,
                    {
                        localStudyId: In(studies.map((study) => study.id)),
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        deletedAt: new Date(),
                    },
                );

                const seriesIds = await transactionalEntityManager
                    .find(SeriesEntity, {
                        where: {
                            localStudyId: In(studies.map((study) => study.id)),
                        },
                        select: {
                            id: true,
                        },
                    })
                    .then((series) => series.map((series) => series.id));

                if (seriesIds.length > 0) {
                    await transactionalEntityManager.update(
                        InstanceEntity,
                        {
                            localSeriesId: In(seriesIds),
                            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        },
                        {
                            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            deletedAt: new Date(),
                        },
                    );
                }

                return {
                    affected: studies.length,
                };
            },
        );
    }

    async restoreInstances(workspaceId: string, instanceIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const result = await transactionalEntityManager.update(
                    InstanceEntity,
                    {
                        id: In(instanceIds),
                        workspaceId,
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        deletedAt: null,
                    },
                );

                if (result.affected && result.affected > 0) {
                    const instances = await transactionalEntityManager.find(
                        InstanceEntity,
                        {
                            where: {
                                id: In(instanceIds),
                            },
                            select: {
                                localSeriesId: true,
                            },
                        },
                    );

                    const seriesIds = instances.map(
                        (instance) => instance.localSeriesId,
                    );
                    await this.updateSeriesInstanceCounts(
                        seriesIds,
                        transactionalEntityManager,
                    );
                    await this.restoreActiveSeries(
                        seriesIds,
                        transactionalEntityManager,
                    );
                }

                return { affected: result.affected ?? 0 };
            },
        );
    }

    async restoreSeries(workspaceId: string, seriesIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const result = await transactionalEntityManager.update(
                    SeriesEntity,
                    {
                        id: In(seriesIds),
                        workspaceId,
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        deletedAt: null,
                    },
                );

                if (result.affected && result.affected > 0) {
                    await transactionalEntityManager.update(
                        InstanceEntity,
                        {
                            localSeriesId: In(seriesIds),
                            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                        },
                        {
                            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                            deletedAt: null,
                        },
                    );

                    const series = await transactionalEntityManager.find(
                        SeriesEntity,
                        {
                            where: { id: In(seriesIds) },
                            select: { localStudyId: true },
                        },
                    );
                    await this.updateStudySeriesCounts(
                        [...new Set(series.map((s) => s.localStudyId))],
                        transactionalEntityManager,
                    );
                }

                return { affected: result.affected ?? 0 };
            },
        );
    }

    async restoreStudies(workspaceId: string, studyIds: string[]) {
        return await this.entityManager.transaction(
            async (transactionalEntityManager) => {
                const result = await transactionalEntityManager.update(
                    StudyEntity,
                    {
                        id: In(studyIds),
                        workspaceId,
                        deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                    },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        deletedAt: null,
                    },
                );

                if (result.affected && result.affected > 0) {
                    const seriesIds = await transactionalEntityManager
                        .find(SeriesEntity, {
                            where: { localStudyId: In(studyIds) },
                            select: { id: true },
                        })
                        .then((series) => series.map((s) => s.id));

                    if (seriesIds.length > 0) {
                        await transactionalEntityManager.update(
                            SeriesEntity,
                            {
                                id: In(seriesIds),
                                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            },
                            {
                                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                                deletedAt: null,
                            },
                        );

                        await transactionalEntityManager.update(
                            InstanceEntity,
                            {
                                localSeriesId: In(seriesIds),
                                deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            },
                            {
                                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                                deletedAt: null,
                            },
                        );
                    }
                }

                return { affected: result.affected ?? 0 };
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

    private async updateSeriesInstanceCounts(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        for (const seriesId of uniqueSeriesIds) {
            const count = await em.count(InstanceEntity, {
                where: {
                    localSeriesId: seriesId,
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                },
            });

            await em.update(
                SeriesEntity,
                { id: seriesId },
                { numberOfSeriesRelatedInstances: count },
            );
        }
    }

    private async updateStudySeriesCounts(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        for (const studyId of uniqueStudyIds) {
            const seriesCount = await em.count(SeriesEntity, {
                where: {
                    localStudyId: studyId,
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                },
            });

            const instanceCount = await em
                .createQueryBuilder(InstanceEntity, "instance")
                .innerJoin(
                    SeriesEntity,
                    "series",
                    "series.id = instance.localSeriesId",
                )
                .where("series.localStudyId = :studyId", { studyId })
                .andWhere("instance.deleteStatus = :deleteStatus", {
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                })
                .getCount();

            await em.update(
                StudyEntity,
                {
                    id: studyId,
                },
                {
                    numberOfStudyRelatedSeries: seriesCount,
                    numberOfStudyRelatedInstances: instanceCount,
                },
            );
        }
    }

    private async recycleEmptySeries(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        for (const id of uniqueSeriesIds) {
            const activeCount = await em.count(InstanceEntity, {
                where: {
                    localSeriesId: id,
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                },
            });

            if (activeCount === 0) {
                const series = await em.findOne(SeriesEntity, {
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        localStudyId: true,
                        deleteStatus: true,
                    },
                });

                if (
                    series &&
                    series.deleteStatus === DICOM_DELETE_STATUS.ACTIVE
                ) {
                    await em.update(
                        SeriesEntity,
                        { id: id },
                        {
                            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            deletedAt: new Date(),
                        },
                    );

                    await this.updateStudySeriesCounts(
                        [series.localStudyId],
                        em,
                    );

                    await this.recycleEmptyStudies([series.localStudyId], em);
                }
            }
        }
    }

    private async recycleEmptyStudies(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        for (const id of uniqueStudyIds) {
            const activeCount = await em.count(SeriesEntity, {
                where: {
                    localStudyId: id,
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                },
            });

            if (activeCount === 0) {
                const study = await em.findOne(StudyEntity, {
                    where: {
                        id: id,
                    },
                    select: {
                        id: true,
                        deleteStatus: true,
                    },
                });

                if (
                    study &&
                    study.deleteStatus === DICOM_DELETE_STATUS.ACTIVE
                ) {
                    await em.update(
                        StudyEntity,
                        { id },
                        {
                            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
                            deletedAt: new Date(),
                        },
                    );
                }
            }
        }
    }

    private async restoreActiveSeries(
        seriesIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (seriesIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueSeriesIds = [...new Set(seriesIds)];

        for (const id of uniqueSeriesIds) {
            const activeCount = await em.count(InstanceEntity, {
                where: {
                    localSeriesId: id,
                    deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                },
            });

            if (activeCount > 0) {
                const series = await em.findOne(SeriesEntity, {
                    where: { id: id },
                    select: { localStudyId: true },
                });

                if (series) {
                    await em.update(
                        SeriesEntity,
                        { id: id },
                        {
                            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                            deletedAt: null,
                        },
                    );

                    await this.updateSeriesInstanceCounts([id], em);
                    await this.restoreActiveStudies([series.localStudyId], em);
                }
            }
        }
    }

    private async restoreActiveStudies(
        studyIds: string[],
        transactionalEntityManager?: EntityManager,
    ) {
        if (studyIds.length === 0) return;

        const em = transactionalEntityManager ?? this.entityManager;
        const uniqueStudyIds = [...new Set(studyIds)];

        for (const id of uniqueStudyIds) {
            const activeCount = await em.count(SeriesEntity, {
                where: {
                    localStudyId: id,
                },
            });

            if (activeCount > 0) {
                await em.update(
                    StudyEntity,
                    { id: id },
                    {
                        deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                        deletedAt: null,
                    },
                );

                await this.updateStudySeriesCounts([id], em);
            }
        }
    }

    private async cleanupEmptySeries(
        seriesIds: string[],
        transactionalEntityManager: EntityManager,
    ) {
        for (const seriesId of seriesIds) {
            const instanceCount = await transactionalEntityManager.count(
                InstanceEntity,
                {
                    where: {
                        localSeriesId: seriesId,
                    },
                },
            );

            if (instanceCount === 0) {
                const series = await transactionalEntityManager.findOne(
                    SeriesEntity,
                    {
                        where: { id: seriesId },
                        select: { id: true, localStudyId: true },
                    },
                );

                if (series) {
                    await transactionalEntityManager.delete(SeriesEntity, {
                        id: seriesId,
                    });
                    await this.cleanupEmptyStudies(
                        series.localStudyId,
                        transactionalEntityManager,
                    );
                }
            }
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
}
