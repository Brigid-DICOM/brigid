"use client";

import type { DicomStudyData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { downloadStudy } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { getDicomStudyThumbnailQuery } from "@/react-query/queries/dicomThumbnail";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";

interface DicomStudiesTableProps {
    studies: DicomStudyData[];
    workspaceId: string;
    className?: string;
}

function ThumbnailCell({
    workspaceId,
    study,
}: {
    workspaceId: string;
    study: DicomStudyData;
}) {
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery({
        ...getDicomStudyThumbnailQuery(workspaceId, studyInstanceUid, "64,64"),
        enabled: studyInstanceUid !== "N/A",
    });

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    if (isLoadingThumbnail) {
        return <Skeleton className="size-16 rounded" />;
    }

    return thumbnailUrl && studyInstanceUid !== "N/A" ? (
        <Image
            src={thumbnailUrl}
            alt="DICOM Study Thumbnail"
            width={64}
            height={64}
            className="size-16 object-cover rounded"
            unoptimized
        />
    ) : (
        <div className="size-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No image
        </div>
    );
}

function ActionsCell({
    study,
    workspaceId,
}: {
    study: DicomStudyData;
    workspaceId: string;
}) {
    const router = useRouter();
    const { clearSelection } = useDicomStudySelectionStore();
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(`/dicom-studies/${studyInstanceUid}`);
    }

    const handleCopyStudyInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(studyInstanceUid);
    }

    const handleDownloadStudy = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadStudy(workspaceId, studyInstanceUid);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="size-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEnterSeries}>
                    Enter Series
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleCopyStudyInstanceUid}
                >
                    Copy Study Instance UID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleDownloadStudy}
                >
                    Download Study
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DicomStudiesDataTable({
    studies,
    workspaceId,
    className,
}: DicomStudiesTableProps) {
    const {
        toggleStudySelection,
        isStudySelected,
        clearSelection,
        selectAll,
        getSelectedCount,
    } = useDicomStudySelectionStore();

    const columns: ColumnDef<DicomStudyData>[] = useMemo(
        () => [
            {
                id: "select",
                header: () => (
                    <Checkbox
                        checked={
                            getSelectedCount() > 0 && getSelectedCount() === studies.length
                        }
                        onCheckedChange={(value) => {
                            const isChecked = !!value;
                            if (isChecked) {
                                selectAll(studies.map((study) => study["0020000D"]?.Value?.[0] || ""));
                            } else {
                                clearSelection();
                            }
                        }}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => {
                    const studyInstanceUid =
                        row.original["0020000D"]?.Value?.[0] || "";
                    const isSelected = isStudySelected(studyInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleStudySelection(studyInstanceUid, true);
                            }}
                            aria-label="Select study"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "thumbnail",
                header: "Preview",
                cell: ({ row }) => {
                    return (
                        <ThumbnailCell
                            study={row.original}
                            workspaceId={workspaceId}
                        />
                    );
                },
            },
            {
                accessorKey: "patientId",
                header: "Patient ID",
                cell: ({ row }) => {
                    const patientId =
                        row.original["00100020"]?.Value?.[0] || "N/A";
                    return <div className="font-medium">{patientId}</div>;
                },
            },
            {
                accessorKey: "patientName",
                header: "Patient Name",
                cell: ({ row }) => {
                    const patientName =
                        row.original["00100010"]?.Value?.[0]?.Alphabetic ||
                        "N/A";

                    return <div>{patientName}</div>;
                },
            },
            {
                accessorKey: "patientBirthDate",
                header: "Patient Birth Date",
                cell: ({ row }) => {
                    const patientBirthDate =
                        row.original["00100030"]?.Value?.[0] || "N/A";
                    return <div>{patientBirthDate}</div>;
                },
            },
            {
                accessorKey: "accessionNumber",
                header: "Accession Number",
                cell: ({ row }) => {
                    const accessionNumber =
                        row.original["00080050"]?.Value?.[0] || "N/A";
                    return <div>{accessionNumber}</div>;
                },
            },
            {
                accessorKey: "modalitiesInStudy",
                header: "Modalities In Study",
                cell: ({ row }) => {
                    const modalitiesInStudy =
                        row.original["00080061"]?.Value?.join(", ") || "N/A";
                    return <div>{modalitiesInStudy}</div>;
                },
            },
            {
                accessorKey: "studyInstanceUid",
                header: "Study Instance UID",
                cell: ({ row }) => {
                    const studyInstanceUid =
                        row.original["0020000D"]?.Value?.[0] || "N/A";
                    return <div className="font-mono text-sm">{studyInstanceUid}</div>;
                },
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                    <ActionsCell
                            study={row.original}
                            workspaceId={workspaceId}
                        />
                    );
                },
            },
        ],
        [workspaceId, studies, clearSelection, selectAll, getSelectedCount, isStudySelected, toggleStudySelection],
    );

    const table = useReactTable({
        data: studies,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        study: DicomStudyData,
    ) => {
        const studyInstanceUid = study["0020000D"]?.Value?.[0] || "";

        if (e.button !== 0) return;

        const target = e.target as HTMLElement;

        if (
            target.closest('[role="checkbox]')||
            target.closest('[role="menuitem"]') ||
            target.closest('button')
        ) {
            return;
        }

        e.preventDefault();
        toggleStudySelection(studyInstanceUid, true);
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const studyInstanceUid =
                                    row.original["0020000D"]?.Value?.[0] || "";
                                const isSelected =
                                    isStudySelected(studyInstanceUid);

                                return (
                                    <TableRow
                                        key={row.id}
                                        data-dicom-card
                                        className={cn(
                                            "cursor-pointer select-none transition-colors",
                                            isSelected && "bg-accent/50",
                                        )}
                                        onClick={(e) => handleRowClick(e, row.original)}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
