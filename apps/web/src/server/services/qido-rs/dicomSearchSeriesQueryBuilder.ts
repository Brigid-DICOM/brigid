import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudySeriesQueryParam } from "@/server/schemas/searchStudySeriesSchema";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    SERIES_SEARCH_FIELDS,
    type SeriesFieldConfig,
} from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";

export type SeriesQueryResult = SeriesEntity & {
    numberOfSeriesRelatedInstances: number;
};

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

    async getSeriesWithRelatedCounts({
        workspaceId,
        limit = 100,
        offset = 0,
        deleteStatus = DICOM_DELETE_STATUS.ACTIVE,
        instanceDeleteStatus,
        ...queryParams
    }: {
        workspaceId: string;
    } & SearchStudySeriesQueryParam & {
        limit?: number;
        offset?: number;
        deleteStatus?: number;
        instanceDeleteStatus?: number;
    }): Promise<SeriesQueryResult[]> {
        const series = await this.execQuery({
            workspaceId,
            limit,
            offset,
            deleteStatus,
            instanceDeleteStatus,
            ...queryParams
        } as {
            workspaceId: string;
            limit: number;
            offset: number;
            deleteStatus: number;
            instanceDeleteStatus?: number;
        } & SearchStudySeriesQueryParam);

        const seriesInstances = series.map(
            s => s.seriesInstanceUid
        );

        if (seriesInstances.length === 0) {
            return [];
        }

        const counts = await this.entityManager
            .createQueryBuilder(SeriesEntity, "series")
            .select("series.seriesInstanceUid", "seriesInstanceUid")
            .addSelect("COUNT(DISTINCT i.sopInstanceUid)", "numberOfSeriesRelatedInstances")
            .leftJoin(
                InstanceEntity,
                "i",
                "i.seriesInstanceUid = series.seriesInstanceUid AND i.deleteStatus = :deleteStatus AND i.workspaceId = series.workspaceId",
                { deleteStatus, workspaceId }
            )
            .where("series.seriesInstanceUid IN (:...seriesInstances)", { seriesInstances })
            .groupBy("series.seriesInstanceUid")
            .getRawMany() as Array<{
                seriesInstanceUid: string;
                numberOfSeriesRelatedInstances: string;
            }>;

        const countMap = new Map(
            counts.map(c => [
                c.seriesInstanceUid,
                {
                    numberOfSeriesRelatedInstances: parseInt(c.numberOfSeriesRelatedInstances || "0", 10),
                }
            ])
        );

        return series.map(s => ({
            ...s,
            numberOfSeriesRelatedInstances: countMap.get(s.seriesInstanceUid)?.numberOfSeriesRelatedInstances ?? 0,
        }));
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
