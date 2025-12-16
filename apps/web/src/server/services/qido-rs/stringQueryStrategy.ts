import { AppDataSource } from "@brigid/database";
import { type QueryDicomResult, QueryStrategy } from "./queryStrategy";

export class StringQueryStrategy extends QueryStrategy {
    buildQuery(table: string, field: string, value: string): QueryDicomResult {
        if (value.includes(",")) {
            return this.buildMultiValueQuery(table, field, value);
        }

        if (value.includes("*") || value.includes("?")) {
            return this.buildWildcardQuery(table, field, value);
        }

        return {
            sql: `${table}.${field} = :value`,
            parameters: {
                value: value,
            },
        };
    }

    private buildMultiValueQuery(
        table: string,
        field: string,
        value: string,
    ): QueryDicomResult {
        const cleanedValues = value
            .split(/(?<!\\),/)
            .map((v) => v.replace(/\\,/g, ","));

        if (cleanedValues.some((v) => v.includes("*") || v.includes("?"))) {
            return this.buildMultiWildcardQuery(table, field, cleanedValues);
        }

        return {
            sql: `${table}.${field} IN (:...values)`,
            parameters: {
                values: cleanedValues,
            },
        };
    }

    private buildMultiWildcardQuery(
        table: string,
        field: string,
        values: string[],
    ): QueryDicomResult {
        const isPostgres = AppDataSource.options.driver === "postgres";
        const likeOperator = isPostgres ? "ILIKE" : "LIKE";

        const sqlParts: string[] = [];
        const parameters: Record<string, string> = {};

        values.forEach((v, index) => {
            const pattern = v.replace(/\*/g, "%").replace(/\?/g, "_");
            sqlParts.push(`${table}.${field} ${likeOperator} :value${index}`);
            parameters[`value${index}`] = pattern;
        });

        return {
            sql: sqlParts.join(" OR "),
            parameters,
        };
    }

    private buildWildcardQuery(
        table: string,
        field: string,
        value: string,
    ): QueryDicomResult {
        const pattern = value.replace(/\*/g, "%").replace(/\?/g, "_");
        const isPostgres = AppDataSource.options.driver === "postgres";
        const likeOperator = isPostgres ? "ILIKE" : "LIKE";

        return {
            sql: `${table}.${field} ${likeOperator} :value`,
            parameters: {
                value: pattern,
            },
        };
    }
}
