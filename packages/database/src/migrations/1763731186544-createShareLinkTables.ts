import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateShareLinkTables1763731186544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "share_link",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "token",
                        type: "varchar",
                        length: "255",
                        isUnique: true
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "creatorId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        name: "publicPermissions",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "accessCount",
                        type: "int",
                        isNullable: false,
                        default: 0
                    },
                    {
                        name: "lastAccessedAt",
                        type: getDateTimeType(),
                        isNullable: true
                    },
                    {
                        name: "requiredPassword",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "passwordHash",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "expiresInSec",
                        type: "int",
                        isNullable: true
                    },
                    {
                        name: "expiresAt",
                        type: getDateTimeType(),
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
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
                        columnNames: ["creatorId"],
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
                ],
                indices: [
                    {
                        name: "idx_share_link_token",
                        columnNames: ["token"],
                    },
                    {
                        name: "idx_share_link_creator",
                        columnNames: ["creatorId"],
                    },
                    {
                        name: "idx_share_link_workspace",
                        columnNames: ["workspaceId"],
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "share_link_target",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "shareLinkId")
                    },
                    {
                        name: "targetType",
                        type: "varchar",
                        length: "50",
                        comment: "target type: study, series, instance"
                    },
                    {
                        name: "targetId",
                        type: "varchar",
                        length: "255",
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
                        columnNames: ["shareLinkId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "share_link",
                        onDelete: "CASCADE"
                    }
                ],
                uniques: [
                    {
                        name: "uq_share_link_target",
                        columnNames: ["shareLinkId", "targetType", "targetId"],
                    }
                ],
                indices: [
                    {
                        name: "idx_share_link_target_share_link",
                        columnNames: ["shareLinkId"],
                    },
                    {
                        name: "idx_share_link_target_type_id",
                        columnNames: ["targetType", "targetId"],
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "share_link_recipient",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "shareLinkId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "userId")
                    },
                    {
                        name: "permissions",
                        type: "int",
                        default: 0,
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
                        columnNames: ["shareLinkId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "share_link",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE"
                    }
                ],
                uniques: [
                    {
                        name: "uq_share_link_recipient",
                        columnNames: ["shareLinkId", "userId"],
                    }
                ],
                indices: [
                    {
                        name: "idx_share_link_recipient_share_link",
                        columnNames: ["shareLinkId"],
                    },
                    {
                        name: "idx_share_link_recipient_user",
                        columnNames: ["userId"],
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("share_link_recipient");
        await queryRunner.dropTable("share_link_target");
        await queryRunner.dropTable("share_link");
    }

}
