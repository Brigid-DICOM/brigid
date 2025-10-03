import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateAuthTables1759306542840 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "user",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "emailVerified",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "image",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ]
            }),
            true
        );

        await queryRunner.createTable(
            new Table({
                name: "account",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "userId")
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "provider",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "providerAccountId",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "refresh_token",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "access_token",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "expires_at",
                        type: "bigint",
                        isNullable: true
                    },
                    {
                        name: "token_type",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "scope",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "id_token",
                        type: "varchar",
                        isNullable: true
                    },
                    {
                        name: "session_state",
                        type: "varchar",
                        isNullable: true
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );

        // create sessions table
        await queryRunner.createTable(
            new Table({
                name: "session",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "userId")
                    },
                    {
                        name: "expires",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "sessionToken",
                        type: "varchar",
                        isNullable: false,
                        isUnique: true
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["userId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "user",
                        onDelete: "CASCADE"
                    }
                ]
            }),
            true
        );

        // create verification_tokens table
        await queryRunner.createTable(
            new Table({
                name: "verification_tokens",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "token",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "identifier",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "expires",
                        type: "varchar",
                        isNullable: false
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const accountsTable = await queryRunner.getTable("account");
        const accountsForeignKey = accountsTable?.foreignKeys.find((fk) =>
            fk.columnNames.includes("userId")
        );
        if (accountsForeignKey) {
            await queryRunner.dropForeignKey("account", accountsForeignKey);
        }

        await queryRunner.dropTable("verification_token");
        await queryRunner.dropTable("session");
        await queryRunner.dropTable("account");
        await queryRunner.dropTable("user");
    }

}
