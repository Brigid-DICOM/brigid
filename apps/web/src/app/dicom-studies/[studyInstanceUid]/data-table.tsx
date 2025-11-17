"use client";

import type { DicomSeriesData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query"; 
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DicomRecycleConfirmDialog } from "@/components/dicom/dicom-recycle-confirm-dialog";
import { DicomSeriesContextMenu } from "@/components/dicom/dicom-series-context-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu,
DropdownMenuContent, 
DropdownMenuItem,
DropdownMenuSeparator,
    DropdownMenuTrigger
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
import { downloadSeries } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesThumbnailQuery, recycleDicomSeriesMutation } from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";

interface DicomSeriesTableProps {
    series: DicomSeriesData[];
    workspaceId: string;
    className?: string;
}

function ThumbnailCell({
    workspaceId,
    series,
}: {
    workspaceId: string;
    series: DicomSeriesData;
}) {
    const studyInstanceUid = series["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getDicomSeriesThumbnailQuery(workspaceId, studyInstanceUid, seriesInstanceUid, "64,64"),
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    if (isLoadingThumbnail) {
        return <Skeleton className="size-16 rounded" />;
    }
    
    return thumbnailUrl && seriesInstanceUid !== "N/A" ? (
        <Image
            src={thumbnailUrl}
            alt="DICOM Series Thumbnail"
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
    series,
    workspaceId,
}: {
    series: DicomSeriesData;
    workspaceId: string;
}) {
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] = useState(false);
    const queryClient = getQueryClient();
    const router = useRouter();
    const studyInstanceUid = series["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const { open: openBlueLightViewer } = useBlueLightViewerStore();

    const { clearSelection, deselectSeries } = useDicomSeriesSelectionStore();

    const { mutate: recycleDicomSeries } = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds: [seriesInstanceUid],
        }),
        onMutate: () => {
            toast.loading("Recycling DICOM series...", {
                id: `recycle-${seriesInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success("DICOM series recycled successfully");
            toast.dismiss(`recycle-${seriesInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            deselectSeries(seriesInstanceUid);
        },
        onError: () => {
            toast.error("Failed to recycle DICOM series");
            toast.dismiss(`recycle-${seriesInstanceUid}`);
        },
    });

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(`/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`);
    }

    const handleCopySeriesInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(seriesInstanceUid);
    }

    const handleDownloadSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadSeries(workspaceId, studyInstanceUid, seriesInstanceUid);
    }
    
    const handleRecycleSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowRecycleConfirmDialog(true);
    }

    const handleConfirmRecycle = () => {
        recycleDicomSeries();
    }

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer(studyInstanceUid, seriesInstanceUid);
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className="size-8 p-0"
                    >
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEnterInstances}>
                        Enter Instances
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenBlueLightViewer}>
                        Open in BlueLight Viewer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopySeriesInstanceUid}>
                        Copy Series Instance UID
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleDownloadSeries}>
                        Download Series
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={handleRecycleSeries}>
                        Recycle Series
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DicomRecycleConfirmDialog 
                open={showRecycleConfirmDialog}
                onOpenChange={setShowRecycleConfirmDialog}
                dicomLevel={"series"}
                selectedCount={1}
                onConfirm={handleConfirmRecycle}
            />
        </>
    )
}

export function DicomSeriesDataTable({
    series,
    workspaceId,
    className,
}: DicomSeriesTableProps) {
    const {
        toggleSeriesSelection,
        isSeriesSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectSeries
    } = useDicomSeriesSelectionStore();

    const columns: ColumnDef<DicomSeriesData>[] = useMemo(
        () => [
            {
                id: "select",
                header: () => (
                    <Checkbox
                        checked={
                            getSelectedCount() > 0 && getSelectedCount() === series.length
                        }
                        onCheckedChange={(value) => {
                            const isChecked = !!value;

                            if (isChecked) {
                                selectAll(series.map((series) => series["0020000E"]?.Value?.[0] || ""));
                            } else {
                                clearSelection();
                            }
                        }}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => {
                    const seriesInstanceUid = row.original["0020000E"]?.Value?.[0] || "";
                    const isSelected = isSeriesSelected(seriesInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleSeriesSelection(seriesInstanceUid, true);
                            }}
                            aria-label="Select series"
                        />
                    )
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
                            series={row.original}
                            workspaceId={workspaceId}
                        />
                    );
                },
            },
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
                    const seriesDescription = row.original["0008103E"]?.Value?.[0] || "N/A";
                    return <div>{seriesDescription}</div>;
                },
            },
            {
                accessorKey: "seriesDate",
                header: "Series Date",
                cell: ({ row }) => {
                    const seriesDate = row.original["00080021"]?.Value?.[0] || "N/A";
                    return <div>{seriesDate}</div>;
                },
            },
            {
                accessorKey: "seriesNumber",
                header: "Series Number",
                cell: ({ row }) => {
                    const seriesNumber = row.original["00200011"]?.Value?.[0] || "N/A";
                    return <div>{seriesNumber}</div>;
                },
            },
            {
                accessorKey: "numberOfSeriesRelatedInstances",
                header: "Related Instances",
                cell: ({ row }) => {
                    const numberOfSeriesRelatedInstances = row.original["00201209"]?.Value?.[0] || "N/A";
                    return <div>{numberOfSeriesRelatedInstances}</div>;
                },
            },
            {
                accessorKey: "seriesInstanceUid",
                header: "Series Instance UID",
                cell: ({ row }) => {
                    const seriesInstanceUid = row.original["0020000E"]?.Value?.[0] || "N/A";
                    return <div className="font-mono text-sm">{seriesInstanceUid}</div>;
                },
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    return <ActionsCell series={row.original} workspaceId={workspaceId} />;
                },
            },
        ],
        [workspaceId, series, clearSelection, selectAll, getSelectedCount, isSeriesSelected, toggleSeriesSelection]
    );

    const table = useReactTable({
        data: series,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        series: DicomSeriesData,
    ) => {
        const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "";

        if (e.button !== 0) return;

        const target = e.target as HTMLElement;

        if (
            target.closest('[role="checkbox"]')||
            target.closest('[role="menuitem"]') ||
            target.closest('button')
        ) {
            return;
        }

        e.preventDefault();
        toggleSeriesSelection(seriesInstanceUid, true);
    }

    return (
        <div className={cn("w-full", className)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const studyInstanceUid = row.original["0020000D"]?.Value?.[0] || "";
                                const seriesInstanceUid = row.original["0020000E"]?.Value?.[0] || "";
                                const isSelected = isSeriesSelected(seriesInstanceUid);

                                return (
                                    <DicomSeriesContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                    >
                                        <TableRow
                                            
                                            data-dicom-card
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50",
                                            )}
                                            onClick={(e) => handleRowClick(e, row.original)}
                                            onContextMenu={() => {
                                                if (getSelectedCount() === 0) {
                                                    selectSeries(seriesInstanceUid);
                                                } else if (getSelectedCount() === 1) {
                                                    clearSelection();
                                                    selectSeries(seriesInstanceUid);
                                                }
                                            }}
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
                                    </DicomSeriesContextMenu>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}