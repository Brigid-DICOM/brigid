import { AppDataSource } from "@brigid/database";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { EntityManager } from "typeorm";

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
        }
        
        return await this.entityManager.save(StudyEntity, studyEntity);
    }
}