import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateStudyTable1759580156312 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "study",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "patientId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "referringPhysicianNameId"),
                        isNullable: true
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        name: "studyPath",
                        type: "varchar",
                        length: "4000",
                        isNullable: false
                    },
                    {
                        name: "dicomPatientId",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "characterSet",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0005"
                    },
                    {
                        name: "studyDate",
                        type: "date",
                        isNullable: true,
                        comment: "0008,0020"
                    },
                    {
                        name: "studyTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0008,0030"
                    },
                    {
                        name: "accessionNumber",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0008,0050"
                    },
                    {
                        name: "instanceAvailability",
                        type: "varchar",
                        length: "64",
                        isNullable: true,
                        comment: "0008,0051"
                    },
                    {
                        name: "timezoneOffsetFromUTC",
                        type: "varchar",
                        length: "32",
                        isNullable: true,
                        comment: "0008,0201"
                    },
                    {
                        name: "studyDescription",
                        type: "varchar",
                        length: "4000",
                        isNullable: true,
                        comment: "0008,1030"
                    },
                    {
                        name: "studyInstanceUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0020,000D"
                    },
                    {
                        name: "studyId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0020,0010"
                    },
                    {
                        name: "numberOfStudyRelatedSeries",
                        type: "int",
                        isNullable: true,
                        comment: "0020,1206"
                    },
                    {
                        name: "numberOfStudyRelatedInstances",
                        type: "int",
                        isNullable: true,
                        comment: "0020,1208"
                    },
                    {
                        name: "deleteStatus",
                        type: "smallint",
                        isNullable: false
                    },
                    {
                        name: "deletedAt",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "json",
                        type: "text",
                        isNullable: false
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
                        columnNames: ["patientId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "patient",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["referringPhysicianNameId"],
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
                        name: "uq_study",
                        columnNames: ["dicomPatientId", "studyInstanceUid", "workspaceId"],
                        isUnique: true
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("study");
    }
}
