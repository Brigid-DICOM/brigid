import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { DicomTag } from "@brigid/types";
import { type EntityManager, In } from "typeorm";
import { DateQueryStrategy } from "./qido-rs/dateQueryStrategy";

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
                id: true,
                json: true
            }
        });
        
        if (existingInstance) {
            instanceEntity.id = existingInstance.id;
            instanceEntity.deleteStatus = DICOM_DELETE_STATUS.ACTIVE;

            const existingInstanceJson = JSON.parse(existingInstance.json ?? "{}") as DicomTag;
            const incomingInstanceJson = JSON.parse(instanceEntity.json ?? "{}") as DicomTag;

            instanceEntity.json  = JSON.stringify({
                ...existingInstanceJson,
                ...incomingInstanceJson,
            });
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

    async getInstancesBySopInstanceUid(workspaceId: string, sopInstanceUids: string[]) {
        return await this.entityManager.find(InstanceEntity, {
            where: {
                workspaceId: workspaceId,
                sopInstanceUid: In(sopInstanceUids)
            },
            select: {
                id: true,
                studyInstanceUid: true,
                seriesInstanceUid: true,
                localSeriesId: true,
                sopInstanceUid: true,
                deleteStatus: true,
                deletedAt: true
            }
        });
    }

    async getInstanceCount(workspaceId: string, range?: string) {
        const countQuery = this.entityManager
        .createQueryBuilder(InstanceEntity, "instance")
        .where("instance.workspaceId = :workspaceId", { workspaceId });
        
        if (range) {
            const dateQueryStrategy = new DateQueryStrategy();
            const dateQuery = dateQueryStrategy.buildQuery("instance", "createdAt", range);
            countQuery.andWhere(dateQuery.sql, dateQuery.parameters);
        }

        return await countQuery.getCount();
    }
}