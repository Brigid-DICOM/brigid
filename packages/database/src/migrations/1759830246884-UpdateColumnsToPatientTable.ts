import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class UpdateColumnsToPatientTable1759830246884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("patient", new TableColumn({
            name: "json",
            type: "text",
            isNullable: false
        }));
        await queryRunner.addColumn("patient", new TableColumn({
            name: "createdAt",
            type: "timestamp",
            isNullable: false
        }));
        await queryRunner.addColumn("patient", new TableColumn({
            name: "updatedAt",
            type: "timestamp",
            isNullable: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("patient", "json");
        await queryRunner.dropColumn("patient", "createdAt");
        await queryRunner.dropColumn("patient", "updatedAt");
    }

}
