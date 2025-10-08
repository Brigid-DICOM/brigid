import { AppDataSource } from "@brigid/database";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import type { EntityManager } from "typeorm";

export class PatientService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async insertOrUpdatePatient(patientEntity: PatientEntity) {
        const existingPatient = await this.entityManager.findOne(PatientEntity, {
            where: {
                dicomPatientId: patientEntity.dicomPatientId,
                workspaceId: patientEntity.workspaceId
            },
            relations: {
                patientName: true
            },
            select: {
                patientName: {
                    id: true
                }
            }
        });
        
        if (existingPatient) {
            patientEntity.id = existingPatient.id;
            
            if (
                "patientName" in patientEntity &&
                patientEntity.patientName &&
                "id" in patientEntity.patientName &&
                existingPatient.patientName
            ) {
                patientEntity.patientName.id =
                    existingPatient.patientName.id;
            }
        }

        return this.entityManager.save(PatientEntity, patientEntity);
    }
}