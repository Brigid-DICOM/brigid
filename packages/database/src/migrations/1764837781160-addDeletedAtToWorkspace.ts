import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class AddDeletedAtToWorkspace1764837781160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "workspace",
            new TableColumn({
                name: "deletedAt",
                type: "timestamp",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("workspace", "deletedAt");
    }

}
