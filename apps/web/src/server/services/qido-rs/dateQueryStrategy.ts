import { type QueryDicomResult, QueryStrategy } from "./queryStrategy";

export class DateQueryStrategy extends QueryStrategy {
    buildQuery(table: string, field: string, value: string): QueryDicomResult {
        const dashIndex = value.indexOf("-");
        if (dashIndex === 0) {
            // -YYYYMMDD
            return {
                sql: `${table}.${field} <= :endDate`,
                parameters: {
                    endDate: value.substring(1),
                },
            };
        } else if (dashIndex === value.length - 1) {
            // YYYYMMDD-
            return {
                sql: `${table}.${field} >= :startDate`,
                parameters: {
                    startDate: value.substring(0, dashIndex),
                },
            };
        } else if (dashIndex > 0) {
            // YYYYMMDD-YYYYMMDD
            return {
                sql: `${table}.${field} >= :startDate AND ${table}.${field} <= :endDate`,
                parameters: {
                    startDate: value.substring(0, dashIndex),
                    endDate: value.substring(dashIndex + 1),
                },
            };
        }

        // YYYYMMDD
        return {
            sql: `${table}.${field} = :date`,
            parameters: {
                date: value,
            },
        };
    }
}
