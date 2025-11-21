import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class ChangeTagAssignmentUqIdx1763710517185 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("tag_assignment", "uq_tag_assignment");
        await queryRunner.createIndex("tag_assignment", new TableIndex({
            name: "uq_tag_assignment",
            columnNames: ["tagId", "targetType", "targetId", "workspaceId"],
            isUnique: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex("tag_assignment", "uq_tag_assignment");
        await queryRunner.createIndex("tag_assignment", new TableIndex({
            name: "uq_tag_assignment",
            columnNames: ["tagId", "targetType", "workspaceId"],
            isUnique: true,
        }));
    }

}
