import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";

export class AddNameColumnToShareLink1764653977927 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("share_link", new TableColumn({
            name: "name",
            type: "varchar",
            length: "255",
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("share_link", "name");
    }

}
