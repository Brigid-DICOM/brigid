import { type MigrationInterface, type QueryRunner, TableIndex } from "typeorm";

export class AddTimeIndexToEventLog1766935045857 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex(
            "event_log",
            new TableIndex({
                name: "idx_event_log_createdAt",
                columnNames: ["createdAt"],
                isUnique: false,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("event_log", "idx_event_log_createdAt");
    }
}
