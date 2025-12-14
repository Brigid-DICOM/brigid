"use client";

import type { DicomSeriesData } from "@brigid/types";
import { useMutation } from "@tanstack/react-query";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useMemo } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import { createSeriesColumns } from "@/components/dicom/data-tables/table-series-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDataTableTagCell } from "@/components/dicom/dicom-data-table-tag-cell";
import { DicomSeriesContextMenu } from "@/components/dicom/dicom-series-context-menu";
import { TagDropdownSub } from "@/components/dicom/tag/tag-dropdown-sub";
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
import { downloadSeries } from "@/lib/clientDownload";
import { closeDropdownMenu, cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomSeriesMutation } from "@/react-query/queries/dicomSeries";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useCreateTagDialogStore } from "@/stores/create-tag-dialog-store";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomSeriesTableProps {
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
    const queryClient = getQueryClient();
    const router = useRouter();
    const studyInstanceUid = series["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const { openDialog: openShareManagementDialog } = useShareManagementDialogStore();
    const { openDialog: openDicomRecycleConfirmDialog } = useDicomRecycleConfirmDialogStore();
    const { openDialog: openCreateTagDialog } = useCreateTagDialogStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const canRecycle =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.DELETE,
        );
    const canRead =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.READ,
        );
    const canUpdate =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.UPDATE,
        );
    const canShare = 
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.MANAGE
        );

    const { clearSelection, deselectSeries } = useDicomSeriesSelectionStore();

    const { mutate: recycleDicomSeries } = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds: [seriesInstanceUid],
        }),
        onMutate: () => {
            toast.loading(t("dicom.messages.recycling", { level: "series" }), {
                id: `recycle-${seriesInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success(t("dicom.messages.recycleSuccess", { level: "series" }));
            toast.dismiss(`recycle-${seriesInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            deselectSeries(seriesInstanceUid);
        },
        onError: () => {
            toast.error(t("dicom.messages.recycleError", { level: "series" }));
            toast.dismiss(`recycle-${seriesInstanceUid}`);
        },
    });

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(
            `/${lng}/${workspaceId}/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`,
        );
    };

    const handleCopySeriesInstanceUid = (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.stopPropagation();
        navigator.clipboard.writeText(seriesInstanceUid);
    };

    const handleDownloadSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadSeries(workspaceId, studyInstanceUid, seriesInstanceUid);
    };

    const handleRecycleSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(t("dicom.messages.noPermissionRecycle", { level: "series" }));
            return;
        }

        e.stopPropagation();
        openDicomRecycleConfirmDialog({
            dicomLevel: "series",
            selectedCount: 1,
            onConfirm: handleConfirmRecycle,
        });
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(t("dicom.messages.noPermissionRecycle", { level: "series" }));
            return;
        }

        recycleDicomSeries();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            studyInstanceUid,
            seriesInstanceUid,
        });
    };

    return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} className="size-8 p-0">
                        <span className="sr-only">{t("dicom.contextMenu.openMenu")}</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {canRead && (
                        <>
                            <DropdownMenuItem
                                onClick={handleCopySeriesInstanceUid}
                            >
                                {t("dicom.contextMenu.copy")} {t("dicom.columns.series.seriesInstanceUid")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEnterInstances}>
                                {t("dicom.contextMenu.enterInstances")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleOpenBlueLightViewer}
                            >
                                {t("dicom.contextMenu.openInBlueLight")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadSeries}>
                                {t("dicom.contextMenu.download")}
                            </DropdownMenuItem>
                        </>
                    )}

                    {canUpdate && (
                        <>
                            <DropdownMenuSeparator />

                            <TagDropdownSub
                                workspaceId={workspaceId}
                                targetId={seriesInstanceUid}
                                targetType="series"
                                onOpenCreateTagDialog={() =>
                                    openCreateTagDialog({
                                        workspaceId,
                                        targetType: "series",
                                        targetId: seriesInstanceUid,
                                    })
                                }
                            />
                        </>
                    )}

                    {canShare && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={(e) => {
                                e.preventDefault();
                                closeDropdownMenu();
                                openShareManagementDialog({
                                    workspaceId,
                                    targetType: "series",
                                    targetIds: [seriesInstanceUid],
                                });
                            }} >
                                {t("dicom.contextMenu.share")}
                            </DropdownMenuItem>
                        </>
                    )}

                    {canRecycle && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleRecycleSeries}>
                                {t("dicom.contextMenu.recycle")}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
    );
}

export function DicomSeriesDataTable({
    series,
    workspaceId,
    className,
}: DicomSeriesTableProps) {
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
                                                row.original["0020000E"]?.Value?.[0] ||
                                                "",
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
            {
                accessorKey: "tags",
                header: t("dicom.columns.tags"),
                cell: ({ row }) => {
                    return (
                        <DicomDataTableTagCell
                            mode="workspace"
                            workspaceId={workspaceId}
                            targetType="series"
                            targetId={
                                row.original["0020000E"]?.Value?.[0] || ""
                            }
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
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
            t
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
                                    </DicomSeriesContextMenu>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("dicom.messages.noData", { level: "series" })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
