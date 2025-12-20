import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudySeriesInstancesQueryParam } from "@/server/schemas/searchStudySeriesInstancesSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    INSTANCE_SEARCH_FIELDS,
    type InstanceFieldConfig,
} from "./dicomSearchInstanceQueryConfig";
import type { SeriesFieldConfig } from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";

export class DicomSearchInstanceQueryBuilder extends BaseDicomSearchQueryBuilder<
    InstanceEntity,
    SearchStudySeriesInstancesQueryParam,
    InstanceFieldConfig | FieldConfig | SeriesFieldConfig
> {
    private readonly instanceTable = "instance";

    protected buildBaseQuery(
        workspaceId: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
        tagName?: string,
    ): SelectQueryBuilder<InstanceEntity> {
        const query = this.entityManager
            .createQueryBuilder(InstanceEntity, this.instanceTable)
            .innerJoinAndSelect("instance.series", "series")
            .innerJoinAndSelect("series.study", "study")
            .innerJoinAndSelect("study.patient", "patient")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            );

        this.applyTagJoin(query, "instance", tagName);
        query
            .where("instance.workspaceId = :workspaceId", { workspaceId })
            .andWhere("instance.deleteStatus = :deleteStatus", {
                deleteStatus,
            });
        this.applyTagFilter(query, tagName);

        return query;
    }

    protected applyInstanceDeleteStatusFilter(
        query: SelectQueryBuilder<InstanceEntity>,
        instanceDeleteStatus: number,
    ): void {
        // instance level 不會有 instance delete status filter
    }

    protected getSearchFields(): readonly (
        | InstanceFieldConfig
        | FieldConfig
        | SeriesFieldConfig
    )[] {
        return INSTANCE_SEARCH_FIELDS;
    }
}
