import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudySeriesInstancesQueryParam } from "@/server/schemas/searchStudySeriesInstancesSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    INSTANCE_SEARCH_FIELDS,
    type InstanceFieldConfig
} from "./dicomSearchInstanceQueryConfig";
import type { SeriesFieldConfig } from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";

export class DicomSearchInstanceQueryBuilder extends BaseDicomSearchQueryBuilder<
    InstanceEntity,
    SearchStudySeriesInstancesQueryParam,
    InstanceFieldConfig | FieldConfig | SeriesFieldConfig
> {
    private readonly instanceTable = "instance";

    protected buildBaseQuery(workspaceId: string): SelectQueryBuilder<InstanceEntity> {
        return this.entityManager
            .createQueryBuilder(InstanceEntity, this.instanceTable)
            .innerJoin("series", "series", "series.id = instance.localSeriesId")
            .innerJoin("study", "study", "study.id = series.localStudyId")
            .innerJoin("patient", "patient", "patient.id = study.patientId")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            )
            .where("instance.workspaceId = :workspaceId", { workspaceId });
    }

    protected getSearchFields(): readonly (InstanceFieldConfig | FieldConfig | SeriesFieldConfig)[] {
        return INSTANCE_SEARCH_FIELDS;
    }
}