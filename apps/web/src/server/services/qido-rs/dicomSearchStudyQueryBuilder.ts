import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudiesQueryParam } from "@/server/schemas/searchStudies";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    type FieldConfig,
    STUDY_SEARCH_FIELDS,
} from "./dicomSearchStudyQueryConfig";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";

export class DicomSearchStudyQueryBuilder extends BaseDicomSearchQueryBuilder<
    StudyEntity,
    SearchStudiesQueryParam,
    FieldConfig
> {
    private readonly studyTable = "study";

    protected buildBaseQuery(
        workspaceId: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
    ): SelectQueryBuilder<StudyEntity> {
        return this.entityManager
            .createQueryBuilder(StudyEntity, this.studyTable)
            .innerJoin("patient", "patient", "patient.id = study.patientId")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            )
            .where("study.workspaceId = :workspaceId", { workspaceId })
            .andWhere("study.deleteStatus = :deleteStatus", { deleteStatus });
    }

    protected applyInstanceDeleteStatusFilter(
        query: SelectQueryBuilder<StudyEntity>,
        instanceDeleteStatus: number
    ): void {
        const subQuery = this.entityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.studyInstanceUid")
            .where("instance.workspaceId = study.workspaceId")
            .andWhere("instance.studyInstanceUid = study.studyInstanceUid")
            .andWhere("instance.deleteStatus = :instanceDeleteStatus", { instanceDeleteStatus })
            .getQuery();
            
        query.andWhere(`EXISTS (${subQuery})`, { instanceDeleteStatus });
    }

    protected getSearchFields(): readonly FieldConfig[] {
        return STUDY_SEARCH_FIELDS;
    }
}
