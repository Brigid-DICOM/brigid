import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class RenameToContentTime1761293029642 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("instance", "contentDateTime", new TableColumn({
            name: "contentTime",
            type: "decimal",
            precision: 12,
            scale: 6,
            isNullable: true,
            comment: "0008,0033"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("instance", "contentTime", new TableColumn({
            name: "contentDateTime",
            type: "decimal",
            precision: 12,
            scale: 6,
            isNullable: true,
            comment: "0008,0033"
        }));
    }
}
