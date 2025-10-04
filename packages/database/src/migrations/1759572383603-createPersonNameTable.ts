import { MigrationInterface, QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getNowColumn, getUuidColumn } from "./helper";

export class CreatePersonNameTable1759572383603 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "person_name",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "alphabetic",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "ideographic",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "phonetic",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("person_name");
    }

}
