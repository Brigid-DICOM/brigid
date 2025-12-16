export interface QueryDicomResult {
    sql: string;
    parameters: Record<string, unknown>;
}

export abstract class QueryStrategy {
    abstract buildQuery(
        table: string,
        field: string,
        value: string,
    ): QueryDicomResult;
}
