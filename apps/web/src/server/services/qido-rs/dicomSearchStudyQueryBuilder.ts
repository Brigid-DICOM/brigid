import { AppDataSource } from "@brigid/database";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { EntityManager, SelectQueryBuilder } from "typeorm";
import type { SearchStudiesQueryParam } from "@/server/schemas/searchStudies";
import { BaseDicomSearchQueryBuilder } from "./baseDicomSearchQueryBuilder";
import {
    type FieldConfig,
    STUDY_SEARCH_FIELDS,
} from "./dicomSearchStudyQueryConfig";

export class DicomSearchStudyQueryBuilder extends BaseDicomSearchQueryBuilder {
    private readonly studyTable = "study";
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        super();
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async execQuery({
        workspaceId,
        limit = 100,
        offset = 0,
        ...queryParams
    }: { workspaceId: string } & SearchStudiesQueryParam & {
            limit?: number;
            offset?: number;
        }) {
        const query = this.buildBaseQuery(workspaceId);
        this.applySearchFilters(query, queryParams);

        return await query.take(limit).skip(offset).getMany();
    }

    private buildBaseQuery(
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

    private applySearchFilters(
        query: SelectQueryBuilder<StudyEntity>,
        queryParams: SearchStudiesQueryParam,
    ): void {
        const appliedJoins = new Set<string>();

        for (let i = 0; i < STUDY_SEARCH_FIELDS.length; i++) {
            const fieldConfig = STUDY_SEARCH_FIELDS[i];
            const value = this.extractParamValue(queryParams, fieldConfig);

            if (!value) continue;

            if (
                fieldConfig.joinConfig &&
                !appliedJoins.has(fieldConfig.joinConfig.alias)
            ) {
                this.applyJoin(query, fieldConfig.joinConfig);
                appliedJoins.add(fieldConfig.joinConfig.alias);
            }

            const uniquePrefix = `param${i + 1}`;

            const condition = this.buildQueryCondition(
                fieldConfig.table,
                fieldConfig.field,
                value,
                fieldConfig.type,
                uniquePrefix,
            );

            query.andWhere(condition.sql, condition.parameters);
        }
    }

    private extractParamValue(
        queryParams: SearchStudiesQueryParam,
        fieldConfig: FieldConfig,
    ): string | undefined {
        for (const key of fieldConfig.paramKeys) {
            const value = queryParams[key] as string | undefined;
            if (value) {
                return value;
            }
        }

        return undefined;
    }

    private applyJoin(
        query: SelectQueryBuilder<StudyEntity>,
        joinConfig: NonNullable<FieldConfig["joinConfig"]>,
    ): void {
        if (joinConfig.type === "leftJoin") {
            query.leftJoin(
                joinConfig.tableName,
                joinConfig.alias,
                joinConfig.condition,
            );
        } else {
            query.innerJoin(
                joinConfig.tableName,
                joinConfig.alias,
                joinConfig.condition,
            );
        }
    }
}
