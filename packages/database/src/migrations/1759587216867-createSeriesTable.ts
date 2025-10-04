import { type MigrationInterface, type QueryRunner, Table } from "typeorm";
import { DICOM_DELETE_STATUS } from "@/const/dicom";
import { enableUuidExtension, getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class CreateSeriesTable1759587216867 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await enableUuidExtension(queryRunner);

        await queryRunner.createTable(
            new Table({
                name: "series",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "localStudyId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "workspaceId")
                    },
                    {
                        ...getUuidReferenceColumn(queryRunner, "seriesDescriptionCodeSequenceId"),
                        isNullable: true
                    },
                    {
                        name: "seriesPath",
                        type: "varchar",
                        length: "4000",
                        isNullable: false
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
                        name: "seriesDate",
                        type: "date",
                        isNullable: true,
                        comment: "0008,0021"
                    },
                    {
                        name: "seriesTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0008,0031"
                    },
                    {
                        name: "modality",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                        comment: "0008,0060"
                    },
                    {
                        name: "seriesDescription",
                        type: "varchar",
                        length: "4000",
                        isNullable: false,
                        comment: "0008,103E"
                    },
                    {
                        name: "seriesNumber",
                        type: "int",
                        isNullable: true,
                        comment: "0020,0011"
                    },
                    {
                        name: "performedProcedureStepStartDate",
                        type: "date",
                        isNullable: true,
                        comment: "0040,0244"
                    },
                    {
                        name: "performedProcedureStepStartTime",
                        type: "decimal",
                        precision: 12,
                        scale: 6,
                        isNullable: true,
                        comment: "0040,0245"
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
                        ...getNowColumn(queryRunner, "createdAt")
                    },
                    {
                        ...getNowColumn(queryRunner, "updatedAt")
                    }
                ],
                foreignKeys: [
                    {
                        columnNames: ["localStudyId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "study",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["workspaceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "workspace",
                        onDelete: "CASCADE"
                    },
                    {
                        columnNames: ["seriesDescriptionCodeSequenceId"],
                        referencedColumnNames: ["id"],
                        referencedTableName: "dicom_code_sequence",
                        onDelete: "CASCADE"
                    }
                ],
                indices: [
                    {
                        name: "uq_series",
                        columnNames: ["studyInstanceUid", "seriesInstanceUid", "workspaceId"],
                        isUnique: true
                    },
                    {
                        name: "idx_series_studyInstanceUid",
                        columnNames: ["studyInstanceUid"]
                    },
                    {
                        name: "idx_series_seriesInstanceUid",
                        columnNames: ["seriesInstanceUid"]
                    },
                    {
                        name: "idx_series_workspaceId",
                        columnNames: ["workspaceId"]
                    },
                    {
                        name: "idx_series_modality",
                        columnNames: ["modality"]
                    }
                ]
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("series");
    }

}
