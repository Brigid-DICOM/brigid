import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreatePatientTable1759574990455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "patient",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "patientNameId")
                    },
                    {
                        name: "dicomPatientId",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0010,0020"
                    },
                    {
                        name: "issuerOfPatientId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0010,0021"
                    },
                    {
                        name: "birthDate",
                        type: "date",
                        isNullable: true,
                        comment: "0010,0030"
                    },
                    {
                        name: "birthTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0010,0032"
                    },
                    {
                        name: "sex",
                        type: "varchar",
                        isNullable: true,
                        comment: "0010,0040"
                    },
                    {
                        name: "age",
                        type: "varchar",
                        isNullable: true,
                        comment: "0010,1010"
                    },
                    {
                        name: "ethnicGroup",
                        type: "varchar",
                        isNullable: true,
                        comment: "0010,2160"
                    },
                    {
                        name: "comment",
                        type: "varchar",
                        isNullable: true,
                        comment: "0010,4000"
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["patientNameId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "person_name",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_patient",
                        columnNames: ["dicomPatientId", "workspaceId"],
                        isUnique: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("patient");
    }

}
