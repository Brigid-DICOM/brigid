import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { DicomTag } from "@brigid/types";
import type { EntityManager } from "typeorm";

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
}
