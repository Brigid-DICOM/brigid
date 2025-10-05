import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { DICOM_DELETE_STATUS } from "@/const/dicom";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateInstanceTable1759646421554 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "instance",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "localSeriesId")
                    },
                    {
                        name: "instancePath",
                        type: "varchar",
                        length: "4000",
                        isNullable: false
                    },
                    {
                        name: "transferSyntaxUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0002,0010"
                    },
                    {
                        name: "studyInstanceUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0020,000D"
                    },
                    {
                        name: "seriesInstanceUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0020,000E"
                    },
                    {
                        name: "sopClassUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0016"
                    },
                    {
                        name: "sopInstanceUid",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0018"
                    },
                    {
                        name: "acquisitionDate",
                        type: "date",
                        isNullable: true,
                        comment: "0008,0022"
                    },
                    {
                        name: "acquisitionDateTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0008,0030"
                    },
                    {
                        name: "contentDate",
                        type: "date",
                        isNullable: true,
                        comment: "0008,0023"
                    },
                    {
                        name: "contentDateTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0008,0033"
                    },
                    {
                        name: "instanceNumber",
                        type: "int",
                        isNullable: true,
                        comment: "0020,0013"
                    },
                    {
                        name: "numberOfFrames",
                        type: "int",
                        isNullable: true,
                        comment: "0028,0008"
                    },
                    {
                        name: "windowCenter",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0028,1050"
                    },
                    {
                        name: "windowWidth",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0028,1051"
                    },
                    {
                        name: "completionFlag",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0040,A491"
                    },
                    {
                        name: "verificationFlag",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0040,A493"
                    },
                    {
                        name: "deleteStatus",
                        type: "smallint",
                        isNullable: false,
                        default: DICOM_DELETE_STATUS.ACTIVE
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
                        name: "hashSum",
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
                ],
                foreignKeys: [
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["localSeriesId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "series",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_instance",
                        columnNames: ["workspaceId", "studyInstanceUid", "seriesInstanceUid", "sopInstanceUid"],
                        isUnique: true
                    },
                    {
                        name: "idx_instance_workspaceId",
                        columnNames: ["workspaceId"]
                    },
                    {
                        name: "idx_instance_localSeriesId",
                        columnNames: ["localSeriesId"]
                    },
                    {
                        name: "idx_instance_studyInstanceUid",
                        columnNames: ["studyInstanceUid"]
                    },
                    {
                        name: "idx_instance_seriesInstanceUid",
                        columnNames: ["seriesInstanceUid"]
                    },
                    {
                        name: "idx_instance_hashSum",
                        columnNames: ["hashSum"]
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("instance");
    }

}
