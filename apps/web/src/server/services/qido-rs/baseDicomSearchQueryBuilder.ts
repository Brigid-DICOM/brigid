import { AppDataSource } from "@brigid/database";
import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { EntityManager, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import type { InstanceFieldConfig } from "./dicomSearchInstanceQueryConfig";
import type { PatientFieldConfig } from "./dicomSearchPatientQueryConfig";
import type { SeriesFieldConfig } from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";
import type { QueryDicomResult } from "./queryStrategy";
import { getQueryStrategy } from "./queryStrategyFactory";
import { StringQueryStrategy } from "./stringQueryStrategy";

export abstract class BaseDicomSearchQueryBuilder<
    TEntity extends ObjectLiteral,
    TQueryParam extends Record<string, unknown>,
    TFieldConfig extends
        | FieldConfig
        | SeriesFieldConfig
        | InstanceFieldConfig
        | PatientFieldConfig = FieldConfig,
> {
    protected readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async execQuery({
        workspaceId,
        limit = 100,
        offset = 0,
        deleteStatus = DICOM_DELETE_STATUS.ACTIVE,
        instanceDeleteStatus,
        tagName,
        ...queryParams
    }: { workspaceId: string } & TQueryParam & {
            limit?: number;
            offset?: number;
            deleteStatus?: number;
            instanceDeleteStatus?: number;
            tagName?: string;
        }) {
        const query = this.buildBaseQuery(workspaceId, deleteStatus, tagName);

        if (instanceDeleteStatus !== undefined) {
            this.applyInstanceDeleteStatusFilter(query, instanceDeleteStatus);
        }

        this.applySearchFilters(query, queryParams as unknown as TQueryParam);
        return await query.take(limit).skip(offset).getMany();
    }

    protected abstract buildBaseQuery(
        workspaceId: string,
        deleteStatus?: number,
        tagName?: string,
    ): SelectQueryBuilder<TEntity>;

    protected abstract getSearchFields(): readonly TFieldConfig[];

    protected abstract applyInstanceDeleteStatusFilter(
        query: SelectQueryBuilder<TEntity>,
        instanceDeleteStatus: number,
    ): void;

    protected applySearchFilters(
        query: SelectQueryBuilder<TEntity>,
        queryParams: TQueryParam,
    ): void {
        const appliedJoins = new Set<string>();
        const searchFields = this.getSearchFields();

        for (let i = 0; i < searchFields.length; i++) {
            const fieldConfig = searchFields[i];
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

    protected extractParamValue(
        queryParams: TQueryParam,
        fieldConfig: TFieldConfig,
    ): string | undefined {
        for (const key of fieldConfig.paramKeys) {
            const value = queryParams[key] as string | undefined;
            if (value) {
                return value;
            }
        }

        return undefined;
    }

    protected applyJoin(
        query: SelectQueryBuilder<TEntity>,
        joinConfig: NonNullable<TFieldConfig["joinConfig"]>,
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

    protected buildQueryCondition(
        table: string,
        field: string,
        value: string,
        type: string,
        uniquePrefix: string,
    ): QueryDicomResult {
        const strategy = getQueryStrategy(type);
        const result = strategy.buildQuery(table, field, value);

        const remappedParameters: Record<string, unknown> = {};
        const paramMapping = new Map<string, string>();

        for (const [originalKey, value] of Object.entries(result.parameters)) {
            const newKey = `${uniquePrefix}_${originalKey}`;
            paramMapping.set(originalKey, newKey);
            remappedParameters[newKey] = value;
        }

        let remappedSql = result.sql;

        for (const [originalKey, newKey] of paramMapping.entries()) {
            remappedSql = remappedSql.replace(
                new RegExp(`:${originalKey}(?![\\w])`, "g"),
                `:${newKey}`,
            );
            remappedSql = remappedSql.replace(
                new RegExp(`:...${originalKey}(?![\\w])`, "g"),
                `:...${newKey}`,
            );
        }

        return {
            sql: remappedSql,
            parameters: remappedParameters,
        };
    }

    protected applyTagJoin(
        query: SelectQueryBuilder<TEntity>,
        targetType: "study" | "series" | "instance",
        tagName?: string,
    ): void {
        if (!tagName) return;

        let targetIdField: string;

        switch (targetType) {
            case "study":
                targetIdField = `study."studyInstanceUid"`;
                break;
            case "series":
                targetIdField = `series."seriesInstanceUid"`;
                break;
            case "instance":
                targetIdField = `instance."sopInstanceUid"`;
                break;
            default:
                throw new Error(`Invalid target type: ${targetType}`);
        }

        query
            .innerJoin(
                "tag_assignment",
                "tag_assignment",
                `tag_assignment.targetType = :targetType AND tag_assignment.targetId = ${targetIdField}`,
                { targetType },
            )
            .innerJoin("tag", "tag", "tag.id = tag_assignment.tagId");
    }

    protected applyTagFilter(
        query: SelectQueryBuilder<TEntity>,
        tagName?: string,
    ): void {
        if (!tagName) return;

        const stringQueryStrategy = new StringQueryStrategy();
        const tagQuery = stringQueryStrategy.buildQuery("tag", "name", tagName);
        query.andWhere(tagQuery.sql, tagQuery.parameters);
    }
}
