import type { DicomStudyData } from "@brigid/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

export function createStudyColumns(t: TFunction): ColumnDef<DicomStudyData>[] {
    return [
        {
            accessorKey: "patientId",
            header: t("dicom.columns.study.patientId"),
            cell: ({ row }) => {
                const patientId =
                    row.original["00100020"]?.Value?.[0] || "N/A";
                return <div className="font-medium">{patientId}</div>;
            },
        },
        {
            accessorKey: "patientName",
            header: t("dicom.columns.study.patientName"),
            cell: ({ row }) => {
                const patientName =
                    row.original["00100010"]?.Value?.[0]?.Alphabetic ||
                    "N/A";

                return <div>{patientName}</div>;
            },
        },
        {
            accessorKey: "patientBirthDate",
            header: t("dicom.columns.study.patientBirthDate"),
            cell: ({ row }) => {
                const patientBirthDate =
                    row.original["00100030"]?.Value?.[0] || "N/A";
                return <div>{patientBirthDate}</div>;
            },
        },
        {
            accessorKey: "accessionNumber",
            header: t("dicom.columns.study.accessionNumber"),
            cell: ({ row }) => {
                const accessionNumber =
                    row.original["00080050"]?.Value?.[0] || "N/A";
                return <div>{accessionNumber}</div>;
            },
        },
        {
            accessorKey: "modalitiesInStudy",
            header: t("dicom.columns.study.modalitiesInStudy"),
            cell: ({ row }) => {
                const modalitiesInStudy =
                    row.original["00080061"]?.Value?.join(", ") || "N/A";
                return <div>{modalitiesInStudy}</div>;
            },
        },
        {
            accessorKey: "studyInstanceUid",
            header: t("dicom.columns.study.studyInstanceUid"),
            cell: ({ row }) => {
                const studyInstanceUid =
                    row.original["0020000D"]?.Value?.[0] || "N/A";
                return (
                    <div className="font-mono text-sm">
                        {studyInstanceUid}
                    </div>
                );
            },
        },
    ];
}
