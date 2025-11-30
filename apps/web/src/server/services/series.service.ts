import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { DicomTag } from "@brigid/types";
import type { EntityManager } from "typeorm";
import { In } from "typeorm";
import { DateQueryStrategy } from "./qido-rs/dateQueryStrategy";

export class SeriesService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async insertOrUpdateSeries(seriesEntity: SeriesEntity) {
        const existingSeries = await this.entityManager.findOne(SeriesEntity, {
            where: {
                studyInstanceUid: seriesEntity.studyInstanceUid,
                seriesInstanceUid: seriesEntity.seriesInstanceUid,
                workspaceId: seriesEntity.workspaceId,
            },
            relations: {
                seriesDescriptionCodeSequence: true,
                seriesRequestAttributes: true,
            },
            select: {
                id: true,
                json: true,
                seriesDescriptionCodeSequence: {
                    id: true,
                },
                seriesRequestAttributes: {
                    id: true,
                },
            },
        });

        if (existingSeries) {
            seriesEntity.id = existingSeries.id;

            if (
                "seriesDescriptionCodeSequence" in seriesEntity &&
                seriesEntity.seriesDescriptionCodeSequence &&
                "id" in seriesEntity.seriesDescriptionCodeSequence &&
                existingSeries.seriesDescriptionCodeSequence
            ) {
                seriesEntity.seriesDescriptionCodeSequence.id =
                    existingSeries.seriesDescriptionCodeSequence.id;
            }

            if (
                "seriesRequestAttributes" in seriesEntity &&
                seriesEntity.seriesRequestAttributes &&
                "id" in seriesEntity.seriesRequestAttributes &&
                existingSeries.seriesRequestAttributes
            ) {
                seriesEntity.seriesRequestAttributes.id =
                    existingSeries.seriesRequestAttributes.id;
            }

            const existingSeriesJson = JSON.parse(
                existingSeries.json ?? "{}",
            ) as DicomTag;
            const incomingSeriesJson = JSON.parse(
                seriesEntity.json ?? "{}",
            ) as DicomTag;

            seriesEntity.json = JSON.stringify({
                ...existingSeriesJson,
                ...incomingSeriesJson,
            });
        }

        return await this.entityManager.save(SeriesEntity, seriesEntity);
    }

    async getSeriesByUid(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }) {
        return await this.entityManager.findOne(SeriesEntity, {
            where: {
                workspaceId: options.workspaceId,
                studyInstanceUid: options.studyInstanceUid,
                seriesInstanceUid: options.seriesInstanceUid,
            },
        });
    }

    async getSeriesBySeriesInstanceUids(workspaceId: string, seriesInstanceUids: string[]) {
        return await this.entityManager.find(SeriesEntity, {
            where: {
                workspaceId: workspaceId,
                seriesInstanceUid: In(seriesInstanceUids),
            },
            select: {
                id: true,
                localStudyId: true,
                studyInstanceUid: true,
                seriesInstanceUid: true,
                deleteStatus: true,
                deletedAt: true
            }
        });
    }
    async getSeriesInstances(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        limit: number;
        offset: number;
    }) {
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            limit,
            offset,
        } = options;
        const [instances, total] = await this.entityManager.findAndCount(
            InstanceEntity,
            {
                where: {
                    workspaceId: workspaceId,
                    studyInstanceUid: studyInstanceUid,
                    seriesInstanceUid: seriesInstanceUid,
                },
                skip: offset,
                take: limit,
            },
        );

        return {
            instances,
            total,
            hasNextPage: instances.length + offset < total,
        };
    }

    async getSeriesInstanceCount(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }) {
        const { workspaceId, studyInstanceUid, seriesInstanceUid } = options;
        return await this.entityManager.count(InstanceEntity, {
            where: { workspaceId, studyInstanceUid, seriesInstanceUid },
        });
    }

    async getSeriesMedianInstance(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }) {
        const instanceCount = await this.getSeriesInstanceCount(options);
        const medianInstanceNumber = instanceCount >> 1;

        return await this.entityManager.find(InstanceEntity, {
            where: {
                workspaceId: options.workspaceId,
                studyInstanceUid: options.studyInstanceUid,
                seriesInstanceUid: options.seriesInstanceUid,
            },
            order: { instanceNumber: "ASC" },
            skip: medianInstanceNumber,
            take: 1,
        });
    }

    async getUniqueModalities(
        workspaceId: string,
        range?: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE
    ) {
        const modalitiesQuery = this.entityManager.createQueryBuilder(SeriesEntity, "series")
            .select("series.modality", "modality")
            .addSelect("COUNT(series.modality)", "count")
            .distinct(true)
            .where("series.workspaceId = :workspaceId", { workspaceId })
            .andWhere("series.deleteStatus = :deleteStatus", { deleteStatus })
            .groupBy("modality")
            .orderBy("count", "DESC");

        if (range) {
            const dateQueryStrategy = new DateQueryStrategy();
            const dateQuery = dateQueryStrategy.buildQuery("series", "createdAt", range);
            modalitiesQuery.andWhere(dateQuery.sql, dateQuery.parameters);
        }

        const modalities = await modalitiesQuery.getRawMany();

        return modalities.map(modality => ({
            modality: modality.modality,
            count: modality.count,
        }));
    }

    async getSeriesInstancesByCursor(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        limit: number;
        lastUpdatedAt?: Date;
        lastId?: string
    }) {
        const { workspaceId, studyInstanceUid, seriesInstanceUid, limit, lastUpdatedAt, lastId } = options;
        const queryBuilder = this.entityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .where("instance.workspaceId = :workspaceId", { workspaceId })
            .andWhere("instance.studyInstanceUid = :studyInstanceUid", { studyInstanceUid })
            .andWhere("instance.seriesInstanceUid = :seriesInstanceUid", { seriesInstanceUid })
            .orderBy("instance.updatedAt", "ASC")
            .addOrderBy("instance.id", "ASC")
            .take(limit);
            
        if (lastUpdatedAt && lastId) {
            queryBuilder.andWhere(
                `(instance.updatedAt > :lastUpdatedAt OR (instance.updatedAt = :lastUpdatedAt AND instance.id > :lastId))`,
                { lastUpdatedAt, lastId }
            )
        }

        // !這裡只返回資料，不計算總數 (count)
        return await queryBuilder.getMany();
    }
}
