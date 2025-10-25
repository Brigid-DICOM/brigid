import { AppDataSource } from "@brigid/database";
import type { EntityManager, ObjectLiteral, SelectQueryBuilder } from "typeorm";
import type { InstanceFieldConfig } from "./dicomSearchInstanceQueryConfig";
import type { SeriesFieldConfig } from "./dicomSearchSeriesQueryConfig";
import type { FieldConfig } from "./dicomSearchStudyQueryConfig";
import type { QueryDicomResult } from "./queryStrategy";
import { getQueryStrategy } from "./queryStrategyFactory";

export abstract class BaseDicomSearchQueryBuilder<
    TEntity extends ObjectLiteral,
    TQueryParam extends Record<string, unknown>,
    TFieldConfig extends FieldConfig | SeriesFieldConfig | InstanceFieldConfig = FieldConfig
> {

    protected readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async execQuery({
        workspaceId,
        limit = 100,
        offset = 0,
        ...queryParams
    }: { workspaceId: string } & TQueryParam & {
        limit?: number;
        offset?: number;
    }) {
        const query = this.buildBaseQuery(workspaceId);
        this.applySearchFilters(query, queryParams as unknown as TQueryParam);
        return await query.take(limit).skip(offset).getMany();
    }

    protected abstract buildBaseQuery(
        workspaceId: string
    ): SelectQueryBuilder<TEntity>;
    
    protected abstract getSearchFields(): readonly TFieldConfig[];

    protected applySearchFilters(
        query: SelectQueryBuilder<TEntity>,
        queryParams: TQueryParam
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
        fieldConfig: TFieldConfig
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
        joinConfig: NonNullable<TFieldConfig["joinConfig"]>
    ): void {
        if (joinConfig.type === "leftJoin") {
            query.leftJoin(
                joinConfig.tableName,
                joinConfig.alias,
                joinConfig.condition
            );
        } else {
            query.innerJoin(
                joinConfig.tableName,
                joinConfig.alias,
                joinConfig.condition
            );
        }
    }

    protected buildQueryCondition(table: string, field: string, value: string, type: string, uniquePrefix: string): QueryDicomResult {
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
                `:${newKey}`
            );
            remappedSql = remappedSql.replace(
                new RegExp(`:...${originalKey}(?![\\w])`, "g"),
                `:...${newKey}`
            );
        }
    
        return {
            sql: remappedSql,
            parameters: remappedParameters,
        };
    }
}