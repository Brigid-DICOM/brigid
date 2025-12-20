import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchPatientsQueryParam } from "@/server/schemas/searchPatientSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import { PATIENT_SEARCH_FIELDS, type PatientFieldConfig } from "./dicomSearchPatientQueryConfig";

export class DicomSearchPatientQueryBuilder extends BaseDicomSearchQueryBuilder<
    PatientEntity,
    SearchPatientsQueryParam,
    PatientFieldConfig
> {
    private readonly patientTable = "patient";

    protected buildBaseQuery(
        workspaceId: string,
        _deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
        _tagName?: string,
    ): SelectQueryBuilder<PatientEntity> {
        const query = this.entityManager
            .createQueryBuilder(PatientEntity, this.patientTable)
            .where(`${this.patientTable}.workspaceId = :workspaceId`, { workspaceId })
            .orderBy(`${this.patientTable}.createdAt`, "DESC");

        return query;
    }

    protected applyInstanceDeleteStatusFilter(
        _query: SelectQueryBuilder<PatientEntity>,
        _instanceDeleteStatus: number,
    ): void {
        // patient level 不會有 instance delete status filter
    }

    protected getSearchFields(): readonly PatientFieldConfig[] {
        return PATIENT_SEARCH_FIELDS;
    }
}