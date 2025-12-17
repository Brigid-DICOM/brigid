import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import {
    enableUuidExtension,
    getNowColumn,
    getUuidColumn,
    getUuidReferenceColumn,
} from "./helper";

export class CreateDimseTables1765948809824 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "dimse_config",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id"),
                    },
                    {
                        name: "aeTitle",
                        type: "varchar",
                        length: "16",
                        isNullable: false,
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId"),
                    },
                    {
                        name: "enabled",
                        type: "boolean",
                        default: false,
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
                ],
                indices: [
                    {
                        name: "uq_dimse_config_ae_title",
                        columnNames: ["aeTitle"],
                        isUnique: true,
                    },
                    {
                        name: "uq_dimse_config_workspace",
                        columnNames: ["workspaceId"],
                        isUnique: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "dimse_allowed_ip",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id"),
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "dimseConfigId"),
                    },
                    {
                        name: "ipMask",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt"),
                    },
                ],
                foreignKeys: [
                    {
                        columnNames: ["dimseConfigId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "dimse_config",
                        onDelete: "CASCADE",
                    },
                ],
            }),
            true,
        );

        await queryRunner.createTable(
            new Table({
                name: "dimse_allowed_remote",
                columns: [
                    { ...getUuidColumn(queryRunner, "id") },
                    { ...getUuidReferenceColumn(queryRunner, "dimseConfigId") },
                    {
                        name: "aeTitle",
                        type: "varchar",
                        length: "16",
                        isNullable: false,
                    },
                    {
                        name: "host",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "port",
                        type: "int",
                        isNullable: false,
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
                        columnNames: ["dimseConfigId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "dimse_config",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_dimse_allowed_remote",
                        columnNames: ["dimseConfigId", "aeTitle", "host", "port"],
                        isUnique: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("dimse_allowed_remote");
        await queryRunner.dropTable("dimse_allowed_ip");
        await queryRunner.dropTable("dimse_config");
    }
}
