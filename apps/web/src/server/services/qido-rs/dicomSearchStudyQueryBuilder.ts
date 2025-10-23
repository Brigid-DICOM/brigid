import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudiesQueryParam } from "@/server/schemas/searchStudies";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    type FieldConfig,
    STUDY_SEARCH_FIELDS,
} from "./dicomSearchStudyQueryConfig";

export class DicomSearchStudyQueryBuilder extends BaseDicomSearchQueryBuilder<
    StudyEntity,
    SearchStudiesQueryParam,
    FieldConfig
> {
    private readonly studyTable = "study";

    protected buildBaseQuery(
        workspaceId: string,
    ): SelectQueryBuilder<StudyEntity> {
        return this.entityManager
            .createQueryBuilder(StudyEntity, this.studyTable)
            .innerJoin("patient", "patient", "patient.id = study.patientId")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            )
            .where("study.workspaceId = :workspaceId", { workspaceId });
    }

    protected getSearchFields(): readonly FieldConfig[] {
        return STUDY_SEARCH_FIELDS;
    }
}
