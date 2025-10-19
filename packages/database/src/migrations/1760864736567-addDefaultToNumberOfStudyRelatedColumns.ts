import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class AddDefaultToNumberOfStudyRelatedColumns1760864736567 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("study", "numberOfStudyRelatedSeries", new TableColumn({
            name: "numberOfStudyRelatedSeries",
            type: "int",
            default: 0,
            comment: "0020,1206",
            isNullable: true
        }));
        await queryRunner.changeColumn("study", "numberOfStudyRelatedInstances", new TableColumn({
            name: "numberOfStudyRelatedInstances",
            type: "int",
            default: 0,
            comment: "0020,1208",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn("study", "numberOfStudyRelatedSeries", new TableColumn({
            name: "numberOfStudyRelatedSeries",
            type: "int",
            comment: "0020,1206",
            isNullable: true
        }));
        await queryRunner.changeColumn("study", "numberOfStudyRelatedInstances", new TableColumn({
            name: "numberOfStudyRelatedInstances",
            type: "int",
            comment: "0020,1208",
            isNullable: true
        }));
    }

}
