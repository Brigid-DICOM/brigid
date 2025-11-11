import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudySeriesQueryParam } from "@/server/schemas/searchStudySeriesSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    SERIES_SEARCH_FIELDS,
    type SeriesFieldConfig,
} from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";

export class DicomSearchSeriesQueryBuilder extends BaseDicomSearchQueryBuilder<
    SeriesEntity,
    SearchStudySeriesQueryParam,
    SeriesFieldConfig | FieldConfig
> {
    private readonly seriesTable = "series";

    protected buildBaseQuery(
        workspaceId: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
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
            .where("series.workspaceId = :workspaceId", { workspaceId })
            .andWhere("series.deleteStatus = :deleteStatus", { deleteStatus });
    }

    protected applyInstanceDeleteStatusFilter(
        query: SelectQueryBuilder<SeriesEntity>,
        instanceDeleteStatus: number
    ): void {
        const subQuery = this.entityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.seriesInstanceUid")
            .where("instance.workspaceId = series.workspaceId")
            .andWhere("instance.seriesInstanceUid = series.seriesInstanceUid")
            .andWhere("instance.deleteStatus = :instanceDeleteStatus", { instanceDeleteStatus })
            .getQuery();
            
        query.andWhere(`EXISTS (${subQuery})`, { instanceDeleteStatus });
    }


    protected getSearchFields(): readonly (SeriesFieldConfig | FieldConfig)[] {
        return SERIES_SEARCH_FIELDS;
    }
}
