import { type QueryDicomResult, QueryStrategy } from "./queryStrategy";

export class NumberQueryStrategy extends QueryStrategy {
    buildQuery(table: string, field: string, value: string): QueryDicomResult {
        if (value.includes(",")) {
            return this.buildMultiValueQuery(table, field, value);
        }

        return {
            sql: `${table}.${field} = :value`,
            parameters: {
                value: Number(value),
            },
        }
    }

    private buildMultiValueQuery(table: string, field: string, value: string): QueryDicomResult {
        const values = value.split(",").map(Number);

        return {
            sql: `${table}.${field} IN (:...values)`,
            parameters: {
                values: values,
            },
        }
    }
}