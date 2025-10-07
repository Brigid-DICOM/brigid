import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class UpdateColumnsToPatientTable1759830246884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("patient", new TableColumn({
            name: "json",
            type: "text",
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("patient", "json");
    }
}
