import { type MigrationInterface, type QueryRunner, Table, TableIndex } from "typeorm";
import { getNowColumn, getUuidColumn } from "./helper";

export class CreateEventLogTable1766905546307 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "event_log",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id"),
                    },
                    {
                        name: "requestId",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "level",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "message",
                        type: "text",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "elapsedTime",
                        type: "int",
                        isNullable: true,
                        comment: "Elapsed time in milliseconds"
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    }
                ]
            }),
            true
        );

        await queryRunner.createIndex(
            "event_log",
            new TableIndex({
                name: "idx_event_log_name",
                columnNames: ["name"],
                isUnique: false,
            })
        );

        await queryRunner.createIndex(
            "event_log",
            new TableIndex({
                name: "idx_event_log_requestId",
                columnNames: ["requestId"],
                isUnique: false,
            })
        );

        await queryRunner.createIndex(
            "event_log",
            new TableIndex({
                name: "idx_event_log_elapsedTime",
                columnNames: ["elapsedTime"],
                isUnique: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("event_log");
    }

}
