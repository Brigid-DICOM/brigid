import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { EntityManager } from "typeorm";

export class InstanceService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async insertOrUpdateInstance(instanceEntity: InstanceEntity) {
        const existingInstance = await this.entityManager.findOne(InstanceEntity, {
            where: {
                studyInstanceUid: instanceEntity.studyInstanceUid,
                seriesInstanceUid: instanceEntity.seriesInstanceUid,
                sopInstanceUid: instanceEntity.sopInstanceUid,
                workspaceId: instanceEntity.workspaceId
            },
            select: {
                id: true
            }
        });
        
        if (existingInstance) {
            instanceEntity.id = existingInstance.id;
        }

        return await this.entityManager.save(InstanceEntity, instanceEntity);
    }

    async getInstanceByUid(options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        sopInstanceUid: string;
    }) {
        return await this.entityManager.findOne(InstanceEntity, {
            where: {
                workspaceId: options.workspaceId,
                studyInstanceUid: options.studyInstanceUid,
                seriesInstanceUid: options.seriesInstanceUid,
                sopInstanceUid: options.sopInstanceUid
            }
        });
    }
}