import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { EntityManager } from "typeorm";
import { DateQueryStrategy } from "./qido-rs/dateQueryStrategy";

export class PatientService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async insertOrUpdatePatient(patientEntity: PatientEntity) {
        const existingPatient = await this.entityManager.findOne(
            PatientEntity,
            {
                where: {
                    dicomPatientId: patientEntity.dicomPatientId,
                    workspaceId: patientEntity.workspaceId,
                },
                relations: {
                    patientName: true,
                },
                select: {
                    id: true,
                    patientName: {
                        id: true,
                    },
                },
            },
        );

        if (existingPatient) {
            patientEntity.id = existingPatient.id;

            if (
                "patientName" in patientEntity &&
                patientEntity.patientName &&
                "id" in patientEntity.patientName &&
                existingPatient.patientName
            ) {
                patientEntity.patientName.id = existingPatient.patientName.id;
            }
        }

        return this.entityManager.save(PatientEntity, patientEntity);
    }

    async getPatientCount(
        workspaceId: string,
        range?: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
    ) {
        const countQuery = this.entityManager
            .createQueryBuilder(PatientEntity, "patient")
            .where("patient.workspaceId = :workspaceId", { workspaceId })
            .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select("1")
                    .from(StudyEntity, "study")
                    .where("study.patientId = patient.id")
                    .andWhere("study.deleteStatus = :deleteStatus", {
                        deleteStatus,
                    })
                    .getQuery();

                return `EXISTS (${subQuery})`;
            });

        if (range) {
            const dateQueryStrategy = new DateQueryStrategy();
            const dateQuery = dateQueryStrategy.buildQuery(
                "patient",
                "createdAt",
                range,
            );
            countQuery.andWhere(dateQuery.sql, dateQuery.parameters);
        }

        return await countQuery.getCount();
    }
}
