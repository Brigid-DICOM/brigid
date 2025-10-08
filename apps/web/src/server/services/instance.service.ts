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
            }
        });
        
        if (existingInstance) {
            instanceEntity.id = existingInstance.id;
        }

        return await this.entityManager.save(InstanceEntity, instanceEntity);
    }
}