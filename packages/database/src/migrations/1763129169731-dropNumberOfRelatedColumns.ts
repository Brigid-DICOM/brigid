import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class DropNumberOfRelatedColumns1763129169731 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("study", "numberOfStudyRelatedSeries");
        await queryRunner.dropColumn("study", "numberOfStudyRelatedInstances");
        await queryRunner.dropColumn("series", "numberOfSeriesRelatedInstances");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("study", new TableColumn({
            name: "numberOfStudyRelatedSeries",
            type: "int",
            isNullable: true,
            comment: "0020,1206"
        }));
        await queryRunner.addColumn("study", new TableColumn({
            name: "numberOfStudyRelatedInstances",
            type: "int",
            isNullable: true,
            comment: "0020,1208"
        }));
        await queryRunner.addColumn("series", new TableColumn({
            name: "numberOfSeriesRelatedInstances",
            type: "int",
            isNullable: true,
            comment: "0020,1209"
        }));

        await queryRunner.query(`
            UPDATE studies SET "numberOfStudyRelatedSeries" = (
                SELECT COUNT(DISTINCT series."seriesInstanceUid") 
                FROM series WHERE series."studyInstanceUid" = studies."studyInstanceUid"
                AND series."deleteStatus" = studies."deleteStatus"
            ), "numberOfStudyRelatedInstances" = (
                SELECT COUNT(DISTINCT instances."sopInstanceUid") 
                FROM instances WHERE instances."studyInstanceUid" = studies."studyInstanceUid"
                AND instances."deleteStatus" = studies."deleteStatus"
            );
            UPDATE series SET "numberOfSeriesRelatedInstances" = (
                SELECT COUNT(DISTINCT instances."sopInstanceUid") 
                FROM instances WHERE instances."seriesInstanceUid" = series."seriesInstanceUid" 
                AND instances."deleteStatus" = series."deleteStatus"
            );
        `);
    }

}
