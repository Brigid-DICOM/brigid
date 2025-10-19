import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class AddNumberOfSeriesRelatedInstancesColumn1760864324156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("series", new TableColumn({
            name: "numberOfSeriesRelatedInstances",
            type: "int",
            isNullable: true,
            comment: "0020,1209",
            default: 0
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("series", "numberOfSeriesRelatedInstances");
    }

}
