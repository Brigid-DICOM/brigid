import type { DicomInstanceData } from "@brigid/types";
import type { ColumnDef } from "@tanstack/react-table";

export const createInstanceColumns = (): ColumnDef<DicomInstanceData>[] => {
    return [
        {
            accessorKey: "instanceNumber",
            header: "Instance #",
            cell: ({ row }) => <div>{row.original["00200013"]?.Value?.[0] || "N/A"}</div>,
        },
        {
            accessorKey: "acquisitionDate",
            header: "Acquisition Date",
            cell: ({ row }) => {
                const acquisitionDate =
                    row.original["00080022"]?.Value?.[0] || "N/A";
                return <div>{acquisitionDate}</div>;
            },
        },
        {
            accessorKey: "contentDate",
            header: "Content Date",
            cell: ({ row }) => {
                const contentDate =
                    row.original["00080023"]?.Value?.[0] || "N/A";
                return <div>{contentDate}</div>;
            },
        },
        {
            accessorKey: "sopClassUid",
            header: "SOP Class",
            cell: ({ row }) => (
                <div className="font-mono text-xs truncate max-w-[200px]">
                    {row.original["00080016"]?.Value?.[0] || "N/A"}
                </div>
            ),
        },
        {
            accessorKey: "sopInstanceUid",
            header: "SOP Instance UID",
            cell: ({ row }) => (
                <div className="font-mono text-xs truncate max-w-[200px]">
                    {row.original["00080018"]?.Value?.[0] || "N/A"}
                </div>
            ),
        },
    ]
}