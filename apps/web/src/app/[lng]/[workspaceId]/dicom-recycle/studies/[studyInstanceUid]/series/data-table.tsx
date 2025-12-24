"use client";

import type { DicomSeriesData } from "@brigid/types";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import { createSeriesColumns } from "@/components/dicom/data-tables/table-series-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDeleteConfirmDialog } from "@/components/dicom/recycle/dicom-delete-confirm-dialog";
import { DicomRecycleSeriesContextMenu } from "@/components/dicom/recycle/dicom-recycle-series-context-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { useSeriesRecycleActions } from "@/hooks/dicom-recycle/use-series-recycle-actions";
import { cn } from "@/lib/utils";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomRecycleSeriesTableProps {
    series: DicomSeriesData[];
    workspaceId: string;
    className?: string;
}

function ActionsCell({
    series,
    workspaceId,
}: {
    series: DicomSeriesData;
    workspaceId: string;
}) {
    const { t } = useT("translation");
    const { lng } = useParams<{ lng: string }>();
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const router = useRouter();
    const studyInstanceUid = series["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const canRead = hasPermission(
        workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.READ,
    );
    const canDelete = hasPermission(
        workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.DELETE,
    );

    const { clearSelection } = useDicomSeriesSelectionStore();

    const { restoreSeries, deleteSeries, setSeriesIds: setRecycleSeriesIds } = useSeriesRecycleActions({
        workspaceId,
        studyInstanceUid,
    });

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(
            `/${lng}/${workspaceId}/dicom-recycle/studies/${studyInstanceUid}/series/${seriesInstanceUid}/instances`,
        );
    };

    const handleCopySeriesInstanceUid = (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.stopPropagation();
        navigator.clipboard.writeText(seriesInstanceUid);
    };

    const handleRestoreSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setRecycleSeriesIds([seriesInstanceUid]);
        restoreSeries();
    };

    const handleDeleteSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        setRecycleSeriesIds([seriesInstanceUid]);
        deleteSeries();
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 p-0">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {canRead && (
                        <>
                            <DropdownMenuItem
                                onClick={handleCopySeriesInstanceUid}
                            >
                                {t("dicom.contextMenu.copy")}{" "}
                                {t("dicom.columns.series.seriesInstanceUid")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEnterInstances}>
                                {t("dicom.contextMenu.enterInstances")}
                            </DropdownMenuItem>
                        </>
                    )}

                    {canDelete && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleRestoreSeries}>
                                {t("dicom.contextMenu.restore")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleDeleteSeries}>
                                {t("dicom.contextMenu.delete")}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DicomDeleteConfirmDialog
                open={showDeleteConfirmDialog}
                onOpenChange={setShowDeleteConfirmDialog}
                dicomLevel="series"
                selectedCount={1}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}

export function DicomRecycleSeriesDataTable({
    series,
    workspaceId,
    className,
}: DicomRecycleSeriesTableProps) {
    const { t } = useT("translation");
    const {
        toggleSeriesSelection,
        isSeriesSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectSeries,
    } = useDicomSeriesSelectionStore();

    const generalColumns = useMemo(() => createSeriesColumns(t), [t]);

    const columns: ColumnDef<DicomSeriesData>[] = useMemo(
        () => [
            {
                id: "select",
                header: ({ table }) => {
                    const rows = table.getRowModel().rows;

                    return (
                        <Checkbox
                            checked={
                                getSelectedCount() > 0 &&
                                getSelectedCount() === rows.length
                            }
                            onCheckedChange={(value) => {
                                const isChecked = !!value;

                                if (isChecked) {
                                    selectAll(
                                        rows.map(
                                            (row) =>
                                                row.original["0020000E"]
                                                    ?.Value?.[0] || "",
                                        ),
                                    );
                                } else {
                                    clearSelection();
                                }
                            }}
                            aria-label="Select all"
                        />
                    );
                },
                cell: ({ row }) => {
                    const seriesInstanceUid =
                        row.original["0020000E"]?.Value?.[0] || "";
                    const isSelected = isSeriesSelected(seriesInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleSeriesSelection(seriesInstanceUid, true);
                            }}
                            aria-label="Select series"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "thumbnail",
                header: t("dicom.columns.preview"),
                cell: ({ row }) => {
                    return (
                        <TableThumbnailCell
                            source={{
                                type: "workspace",
                                workspaceId,
                            }}
                            studyInstanceUid={
                                row.original["0020000D"]?.Value?.[0] || "N/A"
                            }
                            seriesInstanceUid={
                                row.original["0020000E"]?.Value?.[0] || "N/A"
                            }
                            size={64}
                        />
                    );
                },
            },
            ...generalColumns,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    return (
                        <ActionsCell
                            series={row.original}
                            workspaceId={workspaceId}
                        />
                    );
                },
            },
        ],
        [
            workspaceId,
            clearSelection,
            selectAll,
            getSelectedCount,
            isSeriesSelected,
            toggleSeriesSelection,
            generalColumns,
            t,
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
        series: DicomSeriesData,
    ) => {
        const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "";

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
                                    <DicomRecycleSeriesContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
                                        studyInstanceUid={studyInstanceUid}
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
                                    </DicomRecycleSeriesContextMenu>
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
