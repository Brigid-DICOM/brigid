import type { DicomSeriesData } from "@brigid/types";
import type { ColumnDef } from "@tanstack/react-table";

export const createSeriesColumns = (): ColumnDef<DicomSeriesData>[] => {
    return [
        {
            accessorKey: "modality",
            header: "Modality",
            cell: ({ row }) => {
                const modality = row.original["00080060"]?.Value?.[0] || "N/A";
                return <div>{modality}</div>;
            },
        },
        {
            accessorKey: "seriesDescription",
            header: "Series Description",
            cell: ({ row }) => {
                const seriesDescription =
                    row.original["0008103E"]?.Value?.[0] || "N/A";
                return <div>{seriesDescription}</div>;
            },
        },
        {
            accessorKey: "seriesDate",
            header: "Series Date",
            cell: ({ row }) => {
                const seriesDate =
                    row.original["00080021"]?.Value?.[0] || "N/A";
                return <div>{seriesDate}</div>;
            },
        },
        {
            accessorKey: "seriesNumber",
            header: "Series #",
            cell: ({ row }) => {
                const seriesNumber =
                    row.original["00200011"]?.Value?.[0] || "N/A";
                return <div>{seriesNumber}</div>;
            },
        },
        {
            accessorKey: "numberOfSeriesRelatedInstances",
            header: "Related Instances",
            cell: ({ row }) => {
                const numberOfSeriesRelatedInstances =
                    row.original["00201209"]?.Value?.[0] || "N/A";
                return <div>{numberOfSeriesRelatedInstances}</div>;
            },
        },
        {
            accessorKey: "seriesInstanceUid",
            header: "Series Instance UID",
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
