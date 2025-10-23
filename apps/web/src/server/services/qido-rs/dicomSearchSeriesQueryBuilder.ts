import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudySeriesQueryParam } from "@/server/schemas/searchStudySeriesSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    SERIES_SEARCH_FIELDS,
    type SeriesFieldConfig,
} from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";

export class DicomSearchSeriesQueryBuilder extends BaseDicomSearchQueryBuilder<
    SeriesEntity,
    SearchStudySeriesQueryParam,
    SeriesFieldConfig | FieldConfig
> {
    private readonly seriesTable = "series";

    protected buildBaseQuery(
        workspaceId: string,
    ): SelectQueryBuilder<SeriesEntity> {
        return this.entityManager
            .createQueryBuilder(SeriesEntity, this.seriesTable)
            .innerJoin("study", "study", "study.id = series.localStudyId")
            .innerJoin("patient", "patient", "patient.id = study.patientId")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            )
            .where("series.workspaceId = :workspaceId", { workspaceId });
    }


    protected getSearchFields(): readonly (SeriesFieldConfig | FieldConfig)[] {
        return SERIES_SEARCH_FIELDS;
    }
}
