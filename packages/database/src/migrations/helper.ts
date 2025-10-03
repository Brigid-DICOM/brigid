import { type QueryRunner, TableColumn } from "typeorm";

export function getDatabaseType(queryRunner: QueryRunner): string {
    return queryRunner.connection.options.type;
}

export function isPostgres(queryRunner: QueryRunner): boolean {
    return getDatabaseType(queryRunner) === "postgres";
}

export function isSqlite(queryRunner: QueryRunner): boolean {
    return getDatabaseType(queryRunner) === "sqlite";
}

export function getUuidColumn(queryRunner: QueryRunner, columnName: string = "id") {
    if (isPostgres(queryRunner)) {
        return new TableColumn({
            name: columnName,
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
        });
    } else {
        return new TableColumn({
            name: columnName,
            type: "varchar",
            isPrimary: true,
            generationStrategy: "uuid",
            isGenerated: true
        });
    }
}

export function getUuidReferenceColumn(queryRunner: QueryRunner, columnName: string = "id") {
    if (isPostgres(queryRunner)) {
        return new TableColumn({
            name: columnName,
            type: "uuid",
            isNullable: false
        });
    } else {
        return new TableColumn({
            name: columnName,
            type: "varchar",
            isNullable: false
        });
    }
}

export function getNowColumn(queryRunner: QueryRunner, columnName: string = "createdAt") {
    if (isPostgres(queryRunner)) {
        return new TableColumn({
            name: columnName,
            type: "timestamptz",
            isNullable: false,
            default: "NOW()"
        });
    } else {
        return new TableColumn({
            name: columnName,
            type: "datetime",
            isNullable: false
        });
    }
}

export async function enableUuidExtension(queryRunner: QueryRunner) {
    if (isPostgres(queryRunner)) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    }
}