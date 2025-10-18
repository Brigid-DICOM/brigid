import type { QueryDicomResult } from "./queryStrategy";
import { getQueryStrategy } from "./queryStrategyFactory";

export class BaseDicomSearchQueryBuilder {

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