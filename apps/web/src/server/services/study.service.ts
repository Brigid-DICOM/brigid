import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { DicomTag } from "@brigid/types";
import type { EntityManager } from "typeorm";
import { In } from "typeorm";

export class StudyService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }   

    async insertOrUpdateStudy(studyEntity: StudyEntity) {
        const existingStudy = await this.entityManager.findOne(StudyEntity, {
            where: {
                studyInstanceUid: studyEntity.studyInstanceUid,
                workspaceId: studyEntity.workspaceId
            },
            relations: {
                referringPhysicianName: true
            },
            select: {
                id: true,
                json: true,
                referringPhysicianName: {
                    id: true
                }
            }
        });

        if (existingStudy) {
            studyEntity.id = existingStudy.id;
            
            if (
                "referringPhysicianName" in studyEntity &&
                studyEntity.referringPhysicianName &&
                "id" in studyEntity.referringPhysicianName &&
                existingStudy.referringPhysicianName
            ) {
                studyEntity.referringPhysicianName.id = existingStudy.referringPhysicianName.id;
            }

            const existingStudyJson = JSON.parse(existingStudy.json ?? "{}") as DicomTag;
            const incomingStudyJson = JSON.parse(studyEntity.json ?? "{}") as DicomTag;

            studyEntity.json  = JSON.stringify({
                ...existingStudyJson,
                ...incomingStudyJson,
            });
        }
        
        return await this.entityManager.save(StudyEntity, studyEntity);
    }

    async getStudyByUid(options: {
        workspaceId: string;
        studyInstanceUid: string;
    }) {
        return await this.entityManager.findOne(StudyEntity, {
            where: { workspaceId: options.workspaceId, studyInstanceUid: options.studyInstanceUid }
        });
    }

    async getStudiesByStudyInstanceUids(workspaceId: string, studyInstanceUids: string[]) {
        return await this.entityManager.find(StudyEntity, {
            where: { workspaceId: workspaceId, studyInstanceUid: In(studyInstanceUids) },
            select: {
                id: true,
                studyInstanceUid: true,
                deleteStatus: true,
                deletedAt: true
            }
        });
    }

    async getStudyInstances(options: {
        workspaceId: string;
        studyInstanceUid: string;
        limit: number;
        offset: number;
    }) {
        const { workspaceId, studyInstanceUid, limit, offset } = options;
        const [instances, total] = await this.entityManager.findAndCount(InstanceEntity, {
            where: {
                workspaceId: workspaceId,
                studyInstanceUid: studyInstanceUid
            },
            skip: offset,
            take: limit,
            relations: {
                series: true
            }
        });

        return {
            instances,
            total,
            hasNextPage: instances.length + offset < total,
        }
    }

    async getStudyInstanceCount(options: {
        workspaceId: string;
        studyInstanceUid: string;
    }) {
        const { workspaceId, studyInstanceUid } = options;
        return await this.entityManager.count(InstanceEntity, {
            where: { workspaceId, studyInstanceUid },
        });
    }

    async getStudyMedianInstance(options: {
        workspaceId: string;
        studyInstanceUid: string;
    }) {
        const instanceCount = await this.getStudyInstanceCount(options);
        const medianInstanceNumber = instanceCount >> 1;

        return await this.entityManager.find(InstanceEntity, {
            where: {
                workspaceId: options.workspaceId,
                studyInstanceUid: options.studyInstanceUid,
            },
            order: { instanceNumber: "ASC" },
            skip: medianInstanceNumber,
            take: 1,
        });
    }
}