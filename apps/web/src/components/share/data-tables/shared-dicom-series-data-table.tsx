"use client";

import type { DicomSeriesData } from "@brigid/types";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { createSeriesColumns } from "@/components/dicom/data-tables/table-series-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { downloadShareSeries } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { SharedDicomSeriesContextMenu } from "../shared-dicom-series-context-menu";

interface SharedDicomSeriesDataTableProps {
    series: DicomSeriesData[];
    token: string;
    password?: string;
    publicPermissions?: number;
    className?: string;
}

function ActionsCell({
    series,
    token,
    password,
}: {
    series: DicomSeriesData;
    token: string;
    password?: string;
}) {
    const router = useRouter();
    const studyInstanceUid = series["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const { clearSelection } = useDicomSeriesSelectionStore();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        const params = password
            ? `?password=${encodeURIComponent(password)}`
            : "";
        router.push(
            `/share/${token}/studies/${studyInstanceUid}/series/${seriesInstanceUid}${params}`,
        );
    };

    const handleDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        try {
            await downloadShareSeries({
                token,
                studyInstanceUid,
                seriesInstanceUid,
                password,
            });
        } catch (error) {
            console.error("Failed to download series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download series");
        }
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            shareToken: token,
            studyInstanceUid,
            seriesInstanceUid,
            password,
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
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
                <DropdownMenuItem onClick={handleDownload}>
                    Download Series
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function SharedDicomSeriesDataTable({
    series,
    token,
    password,
    publicPermissions = 0,
    className,
}: SharedDicomSeriesDataTableProps) {
    const {
        toggleSeriesSelection,
        isSeriesSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectSeries,
    } = useDicomSeriesSelectionStore();

    const generalColumns = useMemo(() => createSeriesColumns(), []);

    const columns: ColumnDef<DicomSeriesData>[] = useMemo(
        () => [
            {
                id: "select",
                header: () => (
                    <Checkbox
                        checked={
                            getSelectedCount() > 0 &&
                            getSelectedCount() === series.length
                        }
                        onCheckedChange={(value) => {
                            if (value) {
                                selectAll(
                                    series.map(
                                        (s) => s["0020000E"]?.Value?.[0] || "",
                                    ),
                                );
                            } else {
                                clearSelection();
                            }
                        }}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => {
                    const seriesInstanceUid =
                        row.original["0020000E"]?.Value?.[0] || "";
                    return (
                        <Checkbox
                            checked={isSeriesSelected(seriesInstanceUid)}
                            onCheckedChange={() =>
                                toggleSeriesSelection(seriesInstanceUid, true)
                            }
                            aria-label="Select series"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "thumbnail",
                header: "Preview",
                cell: ({ row }) => (
                    <TableThumbnailCell
                        source={{
                            type: "share",
                            token: token,
                            password: password,
                        }}
                        studyInstanceUid={
                            row.original["0020000D"]?.Value?.[0] || "N/A"
                        }
                        seriesInstanceUid={
                            row.original["0020000E"]?.Value?.[0] || "N/A"
                        }
                    />
                ),
            },
            ...generalColumns,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <ActionsCell
                        series={row.original}
                        token={token}
                        password={password}
                    />
                ),
            },
        ],
        [
            token,
            password,
            series,
            clearSelection,
            selectAll,
            getSelectedCount,
            isSeriesSelected,
            toggleSeriesSelection,
            generalColumns,
        ],
    );

    const table = useReactTable({
        data: series,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false,
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        seriesItem: DicomSeriesData,
    ) => {
        const seriesInstanceUid = seriesItem["0020000E"]?.Value?.[0] || "";
        if (e.button !== 0) return;

        const target = e.target as HTMLElement;
        if (
            target.closest('[role="checkbox"]') ||
            target.closest('[role="menuitem"]') ||
            target.closest("button")
        ) {
            return;
        }

        e.preventDefault();
        toggleSeriesSelection(seriesInstanceUid, true);
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
                                const seriesInstanceUid =
                                    row.original["0020000E"]?.Value?.[0] || "";
                                const isSelected =
                                    isSeriesSelected(seriesInstanceUid);

                                return (
                                    <SharedDicomSeriesContextMenu
                                        key={row.id}
                                        token={token}
                                        password={password}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                        publicPermissions={publicPermissions}
                                    >
                                        <TableRow
                                            data-dicom-card
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50",
                                            )}
                                            onClick={(e) =>
                                                handleRowClick(e, row.original)
                                            }
                                            onContextMenu={() => {
                                                if (getSelectedCount() === 0) {
                                                    selectSeries(
                                                        seriesInstanceUid,
                                                    );
                                                } else if (
                                                    getSelectedCount() === 1
                                                ) {
                                                    clearSelection();
                                                    selectSeries(
                                                        seriesInstanceUid,
                                                    );
                                                }
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </SharedDicomSeriesContextMenu>
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
