import { type MigrationInterface, type QueryRunner, TableColumn, TableIndex } from "typeorm";

export class AddWorkspaceIdToEventLog1766935255090 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("event_log", new TableColumn({
            name: "workspaceId",
            type: "varchar",
            length: "255",
            isNullable: true,
        }));
        await queryRunner.createIndex("event_log", new TableIndex({
            name: "idx_event_log_workspaceId",
            columnNames: ["workspaceId"],
            isUnique: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("event_log", "idx_event_log_workspaceId");
        await queryRunner.dropColumn("event_log", "workspaceId");
    }

}
