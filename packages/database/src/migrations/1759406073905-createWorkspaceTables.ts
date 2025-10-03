import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import {
    enableUuidExtension,
    getNowColumn,
    getUuidColumn,
    getUuidReferenceColumn
} from "./helper";

export class CreateWorkspaceTables1759406073905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "workspace",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "4000"
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "ownerId")
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["ownerId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "user_workspace",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "userId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        name: "role",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                        default: "'member'"
                    },
                    {
                        name: "isDefault",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "permissions",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ],
                uniques: [
                    {
                        name: "uq_user_workspace",
                        columnNames: ["userId", "workspaceId"]
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("user_workspace");
        await queryRunner.dropTable("workspace");
    }

}
