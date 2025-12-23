import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { SelectQueryBuilder } from "typeorm";
import type { SearchStudiesQueryParam } from "@/server/schemas/searchStudies";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    type FieldConfig,
    STUDY_SEARCH_FIELDS,
} from "./dicomSearchStudyQueryConfig";

export type StudyQueryResult = StudyEntity & {
    numberOfStudyRelatedSeries: number;
    numberOfStudyRelatedInstances: number;
};

export class DicomSearchStudyQueryBuilder extends BaseDicomSearchQueryBuilder<
    StudyEntity,
    SearchStudiesQueryParam,
    FieldConfig
> {
    private readonly studyTable = "study";

    protected buildBaseQuery(
        workspaceId: string,
        deleteStatus: number = DICOM_DELETE_STATUS.ACTIVE,
        tagName?: string,
    ): SelectQueryBuilder<StudyEntity> {
        const query = this.entityManager
            .createQueryBuilder(StudyEntity, this.studyTable)
            .innerJoinAndSelect("study.patient", "patient")
            .innerJoin(
                "person_name",
                "patientName",
                "patientName.id = patient.patientNameId",
            );

        this.applyTagJoin(query, "study", tagName);
        query
            .where("study.workspaceId = :workspaceId", { workspaceId })

        if (deleteStatus !== undefined) {
            query.andWhere("study.deleteStatus = :deleteStatus", { deleteStatus });
        }
        
        this.applyTagFilter(query, tagName);

        return query;
    }

    async getStudiesWithRelatedCounts({
        workspaceId,
        limit = 100,
        offset = 0,
        deleteStatus,
        instanceDeleteStatus,
        tagName,
        ...queryParams
    }: {
        workspaceId: string;
    } & SearchStudiesQueryParam & {
            limit?: number;
            offset?: number;
            deleteStatus?: number;
            instanceDeleteStatus?: number;
            tagName?: string;
        }): Promise<StudyQueryResult[]> {
        const studies = await this.execQuery({
            workspaceId,
            limit,
            offset,
            deleteStatus,
            instanceDeleteStatus,
            tagName,
            ...queryParams,
        });

        const studyInstances = studies.map((s) => s.studyInstanceUid);

        if (studyInstances.length === 0) {
            return [];
        }

        const counts = (await this.entityManager
            .createQueryBuilder(StudyEntity, "study")
            .select("study.studyInstanceUid", "studyInstanceUid")
            .addSelect(
                "COUNT(DISTINCT s.seriesInstanceUid)",
                "numberOfStudyRelatedSeries",
            )
            .addSelect(
                "COUNT(DISTINCT i.sopInstanceUid)",
                "numberOfStudyRelatedInstances",
            )
            .leftJoin(
                SeriesEntity,
                "s",
                "s.studyInstanceUid = study.studyInstanceUid AND s.workspaceId = study.workspaceId",
                { workspaceId },
            )
            .leftJoin(
                InstanceEntity,
                "i",
                "i.studyInstanceUid = study.studyInstanceUid AND i.deleteStatus = :deleteStatus AND i.workspaceId = study.workspaceId",
                { deleteStatus: instanceDeleteStatus ?? DICOM_DELETE_STATUS.ACTIVE, workspaceId },
            )
            .where("study.studyInstanceUid IN (:...studyInstances)", {
                studyInstances,
            })
            .groupBy("study.studyInstanceUid")
            .getRawMany()) as Array<{
            studyInstanceUid: string;
            numberOfStudyRelatedSeries: string;
            numberOfStudyRelatedInstances: string;
        }>;

        const countMap = new Map(
            counts.map((c) => [
                c.studyInstanceUid,
                {
                    numberOfStudyRelatedSeries: parseInt(
                        c.numberOfStudyRelatedSeries || "0",
                        10,
                    ),
                    numberOfStudyRelatedInstances: parseInt(
                        c.numberOfStudyRelatedInstances || "0",
                        10,
                    ),
                },
            ]),
        );

        return studies.map((s) => ({
            ...s,
            numberOfStudyRelatedSeries:
                countMap.get(s.studyInstanceUid)?.numberOfStudyRelatedSeries ??
                0,
            numberOfStudyRelatedInstances:
                countMap.get(s.studyInstanceUid)
                    ?.numberOfStudyRelatedInstances ?? 0,
        }));
    }

    protected applyInstanceDeleteStatusFilter(
        query: SelectQueryBuilder<StudyEntity>,
        instanceDeleteStatus: number,
    ): void {
        const subQuery = this.entityManager
            .createQueryBuilder(InstanceEntity, "instance")
            .select("instance.studyInstanceUid")
            .where("instance.workspaceId = study.workspaceId")
            .andWhere("instance.studyInstanceUid = study.studyInstanceUid")
            .andWhere("instance.deleteStatus = :instanceDeleteStatus", {
                instanceDeleteStatus,
            })
            .getQuery();

        query.andWhere(`EXISTS (${subQuery})`, { instanceDeleteStatus });
    }

    protected getSearchFields(): readonly FieldConfig[] {
        return STUDY_SEARCH_FIELDS;
    }
}
