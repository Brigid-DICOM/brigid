import { type MigrationInterface, type QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";
import { getNowColumn, getUuidColumn, getUuidReferenceColumn } from "./helper";

export class AddSeriesRequestAttributesTable1761038228473 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "series_request_attributes",
                columns: [
                    {
                        ...getUuidColumn(queryRunner, "id")
                    },
                    {
                        name: "studyInstanceUid",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0020,000D"
                    },
                    {
                        name: "accessionNumber",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0008,0050"
                    },
                    {
                        name: "accLocalNamespaceEntityId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "(0008,0051).(0040,0031)"
                    },
                    {
                        name: "accUniversalEntityId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "(0008,0051).(0040,0032)"
                    },
                    {
                        name: "accUniversalEntityIdType",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "(0008,0051).(0040,0033)"
                    },
                    {
                        name: "requestedProcedureId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0040,1001"
                    },
                    {
                        name: "scheduledProcedureStepId",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                        comment: "0040,0009"
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

        await queryRunner.addColumn("series", new TableColumn({
            ...getUuidReferenceColumn(queryRunner, "seriesRequestAttributesId"),
            isNullable: true,
            comment: "0040,0275"
        }));

        await queryRunner.createForeignKey("series", new TableForeignKey({
            name: "fk_series_seriesRequestAttributesId",
            columnNames: ["seriesRequestAttributesId"],
            referencedColumnNames: ["id"],
            referencedTableName: "series_request_attributes",
            onDelete: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("series", "fk_series_seriesRequestAttributesId");
        await queryRunner.dropColumn("series", "seriesRequestAttributesId");

        await queryRunner.dropTable("series_request_attributes");
    }

}
