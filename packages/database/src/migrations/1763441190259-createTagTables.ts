import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateTagTables1763441190259 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "tag",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "7",
                        isNullable: false
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
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
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_tag_name_workspace",
                        columnNames: ["name", "workspaceId"],
                        isUnique: true
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "tag_assignment",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "tagId")
                    },
                    {
                        name: "targetType",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "targetId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
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
                        columnNames: ["tagId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "tag",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_tag_assignment",
                        columnNames: ["tagId", "targetType", "workspaceId"],
                        isUnique: true
                    },
                    {
                        name: "idx_tag_assignment_target",
                        columnNames: ["targetType", "targetId"]
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("tag_assignment");
        await queryRunner.dropTable("tag");
    }

}
