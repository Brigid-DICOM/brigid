import type { DicomSeriesData } from "@brigid/types";
import type { ColumnDef } from "@tanstack/react-table";
import type { TFunction } from "i18next";

export const createSeriesColumns = (
    t: TFunction,
): ColumnDef<DicomSeriesData>[] => {
    return [
        {
            accessorKey: "modality",
            header: t("dicom.columns.series.modality"),
            cell: ({ row }) => {
                const modality = row.original["00080060"]?.Value?.[0] || "N/A";
                return <div>{modality}</div>;
            },
        },
        {
            accessorKey: "seriesDescription",
            header: t("dicom.columns.series.description"),
            cell: ({ row }) => {
                const seriesDescription =
                    row.original["0008103E"]?.Value?.[0] || "N/A";
                return <div>{seriesDescription}</div>;
            },
        },
        {
            accessorKey: "seriesDate",
            header: t("dicom.columns.series.date"),
            cell: ({ row }) => {
                const seriesDate =
                    row.original["00080021"]?.Value?.[0] || "N/A";
                return <div>{seriesDate}</div>;
            },
        },
        {
            accessorKey: "seriesNumber",
            header: t("dicom.columns.series.number"),
            cell: ({ row }) => {
                const seriesNumber =
                    row.original["00200011"]?.Value?.[0] || "N/A";
                return <div>{seriesNumber}</div>;
            },
        },
        {
            accessorKey: "numberOfSeriesRelatedInstances",
            header: t("dicom.columns.series.relatedInstances"),
            cell: ({ row }) => {
                const numberOfSeriesRelatedInstances =
                    row.original["00201209"]?.Value?.[0] || "N/A";
                return <div>{numberOfSeriesRelatedInstances}</div>;
            },
        },
        {
            accessorKey: "seriesInstanceUid",
            header: t("dicom.columns.series.seriesInstanceUid"),
            cell: ({ row }) => {
                const seriesInstanceUid =
                    row.original["0020000E"]?.Value?.[0] || "N/A";
                return (
                    <div className="font-mono text-sm">{seriesInstanceUid}</div>
                );
            },
        },
    ];
};
