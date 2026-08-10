import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import {
    enableUuidExtension,
    getNowColumn,
    getUuidColumn,
    getUuidReferenceColumn,
    isPostgres,
} from "./helper";

export class CreateRoutingTables1770532800000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        const jsonType = isPostgres(queryRunner) ? "jsonb" : "text";
        const boolType = isPostgres(queryRunner) ? "boolean" : "integer";
        const boolDefault = isPostgres(queryRunner) ? "true" : "1";
        const boolFalseDefault = isPostgres(queryRunner) ? "false" : "0";
        const dateType = isPostgres(queryRunner) ? "timestamp" : "datetime";

        await queryRunner.createTable(
            new Table({
                name: "routing_destination",
                columns: [
                    { ...getUuidColumn(queryRunner, "id") },
                    { ...getUuidReferenceColumn(queryRunner, "workspaceId") },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "16",
                        isNullable: false,
                    },
                    {
                        name: "enabled",
                        type: boolType,
                        default: boolDefault,
                    },
                    {
                        name: "aeTitle",
                        type: "varchar",
                        length: "16",
                        isNullable: true,
                    },
                    {
                        name: "host",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "port",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "baseUrl",
                        type: "varchar",
                        length: "2048",
                        isNullable: true,
                    },
                    {
                        name: "authType",
                        type: "varchar",
                        length: "16",
                        isNullable: true,
                    },
                    {
                        name: "authUsername",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "authSecretEncrypted",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    { ...getNowColumn(queryRunner, "createdAt") },
                ],
                foreignKeys: [
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE",
                    },
                ],
                indices: [
                    {
                        name: "idx_routing_destination_workspace",
                        columnNames: ["workspaceId"],
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "routing_tag",
                columns: [
                    { ...getUuidColumn(queryRunner, "id") },
                    { ...getUuidReferenceColumn(queryRunner, "workspaceId") },
                    {
                        name: "tagKey",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "label",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    { ...getNowColumn(queryRunner, "createdAt") },
                ],
                foreignKeys: [
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE",
                    },
                ],
                indices: [
                    {
                        name: "uq_routing_tag_workspace_key",
                        columnNames: ["workspaceId", "tagKey"],
                        isUnique: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "routing_rule",
                columns: [
                    { ...getUuidColumn(queryRunner, "id") },
                    { ...getUuidReferenceColumn(queryRunner, "workspaceId") },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "enabled",
                        type: boolType,
                        default: boolDefault,
                    },
                    {
                        name: "priority",
                        type: "int",
                        default: 0,
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "destinationId"),
                    },
                    {
                        name: "delaySeconds",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "conditions",
                        type: jsonType,
                        isNullable: false,
                    },
                    { ...getNowColumn(queryRunner, "createdAt") },
                    { ...getNowColumn(queryRunner, "updatedAt") },
                ],
                foreignKeys: [
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["destinationId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "routing_destination",
                        onDelete: "CASCADE",
                    },
                ],
                indices: [
                    {
                        name: "idx_routing_rule_workspace_priority",
                        columnNames: ["workspaceId", "priority"],
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "routing_job",
                columns: [
                    { ...getUuidColumn(queryRunner, "id") },
                    { ...getUuidReferenceColumn(queryRunner, "workspaceId") },
                    { ...getUuidReferenceColumn(queryRunner, "ruleId") },
                    {
                        ...getUuidReferenceColumn(queryRunner, "destinationId"),
                    },
                    {
                        name: "sopInstanceUid",
                        type: "varchar",
                        length: "64",
                        isNullable: false,
                    },
                    {
                        name: "studyInstanceUid",
                        type: "varchar",
                        length: "64",
                        isNullable: false,
                    },
                    {
                        name: "seriesInstanceUid",
                        type: "varchar",
                        length: "64",
                        isNullable: false,
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "16",
                        isNullable: false,
                    },
                    {
                        name: "scheduledAt",
                        type: dateType,
                        isNullable: false,
                    },
                    {
                        name: "attempt",
                        type: "int",
                        default: 0,
                    },
                    {
                        name: "lastError",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "warning",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "pendingRebuild",
                        type: boolType,
                        default: boolFalseDefault,
                    },
                    { ...getNowColumn(queryRunner, "createdAt") },
                    { ...getNowColumn(queryRunner, "updatedAt") },
                    {
                        name: "completedAt",
                        type: dateType,
                        isNullable: true,
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["ruleId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "routing_rule",
                        onDelete: "CASCADE",
                    },
                    {
                        columnNames: ["destinationId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "routing_destination",
                        onDelete: "CASCADE",
                    },
                ],
                indices: [
                    {
                        name: "uq_routing_job_workspace_rule_sop",
                        columnNames: [
                            "workspaceId",
                            "ruleId",
                            "sopInstanceUid",
                        ],
                        isUnique: true,
                    },
                    {
                        name: "idx_routing_job_poll",
                        columnNames: ["status", "scheduledAt"],
                    },
                ],
            }),
            true,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("routing_job");
        await queryRunner.dropTable("routing_rule");
        await queryRunner.dropTable("routing_tag");
        await queryRunner.dropTable("routing_destination");
    }
}
