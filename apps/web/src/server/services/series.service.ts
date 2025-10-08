import { AppDataSource } from "@brigid/database";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
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
                workspaceId: seriesEntity.workspaceId
            },
            relations: {
                seriesDescriptionCodeSequence: true
            },
            select: {
                seriesDescriptionCodeSequence: {
                    id: true
                }
            }
        });

        if (existingSeries) {
            seriesEntity.id = existingSeries.id;
            
            if (
                "seriesDescriptionCodeSequence" in seriesEntity &&
                seriesEntity.seriesDescriptionCodeSequence &&
                "id" in seriesEntity.seriesDescriptionCodeSequence &&
                existingSeries.seriesDescriptionCodeSequence
            ) {
                seriesEntity.seriesDescriptionCodeSequence.id = existingSeries.seriesDescriptionCodeSequence.id;
            }
        }

        return await this.entityManager.save(SeriesEntity, seriesEntity);
    }
}