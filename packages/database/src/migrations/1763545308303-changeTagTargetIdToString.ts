import { type MigrationInterface, type QueryRunner, TableColumn } from "typeorm";
import { getUuidReferenceColumn } from "./helper";

export class ChangeTagTargetIdToString1763545308303 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "tag_assignment", 
            "targetId",
            new TableColumn({
                name: "targetId",
                type: "varchar",
                length: "255",
                isNullable: false
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn(
            "tag_assignment",
            "targetId",
            getUuidReferenceColumn(queryRunner, "targetId")
        );
    }

}
