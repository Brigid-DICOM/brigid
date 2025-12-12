import type { DicomInstanceData } from "@brigid/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

export const createInstanceColumns = (t: TFunction): ColumnDef<DicomInstanceData>[] => {
    return [
        {
            accessorKey: "instanceNumber",
            header: t("dicom.columns.instance.number"),
            cell: ({ row }) => <div>{row.original["00200013"]?.Value?.[0] || "N/A"}</div>,
        },
        {
            accessorKey: "acquisitionDate",
            header: t("dicom.columns.instance.acquisitionDate"),
            cell: ({ row }) => {
                const acquisitionDate =
                    row.original["00080022"]?.Value?.[0] || "N/A";
                return <div>{acquisitionDate}</div>;
            },
        },
        {
            accessorKey: "contentDate",
            header: t("dicom.columns.instance.contentDate"),
            cell: ({ row }) => {
                const contentDate =
                    row.original["00080023"]?.Value?.[0] || "N/A";
                return <div>{contentDate}</div>;
            },
        },
        {
            accessorKey: "sopClassUid",
            header: t("dicom.columns.instance.sopClassUid"),
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original["00080016"]?.Value?.[0] || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "sopInstanceUid",
            header: t("dicom.columns.instance.sopInstanceUid"),
            cell: ({ row }) => (
                <div className="font-mono text-xs">
                    {row.original["00080018"]?.Value?.[0] || "N/A"}
                </div>
            ),
        },
    ]
}