import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getUuidColumn } from "./helper";

export class CreateDicomCodeSequenceTable1759584745322 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "dicom_code_sequence",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "codeValue",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0100 or 0008,0119 or 0008,0120"
                    },
                    {
                        name: "codingSchemeDesignator",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0008,0102"
                    },
                    {
                        name: "codingSchemeVersion",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0008,0103"
                    },
                    {
                        name: "codeMeaning",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0104"
                    }
                ],
                indices: [
                    {
                        name: "uq_dicom_code_sequence",
                        columnNames: ["codeValue"],
                        isUnique: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("dicom_code_sequence");
    }
}
