"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useMutation } from "@tanstack/react-query";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import { createInstanceColumns } from "@/components/dicom/data-tables/table-instance-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDeleteConfirmDialog } from "@/components/dicom/recycle/dicom-delete-confirm-dialog";
import { DicomRecycleInstanceContextMenu } from "@/components/dicom/recycle/dicom-recycle-instance-context-menu";
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
import { cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteDicomInstanceMutation,
    restoreDicomInstanceMutation,
} from "@/react-query/queries/dicomInstance";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomRecycleInstancesTableProps {
    instances: DicomInstanceData[];
    workspaceId: string;
    className?: string;
}

function ActionsCell({
    instance,
    workspaceId,
}: {
    instance: DicomInstanceData;
    workspaceId: string;
}) {
    const { t } = useT("translation");
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const queryClient = getQueryClient();
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";

    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const canRead = hasPermission(
        workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.READ,
    );
    const canDelete = hasPermission(
        workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.DELETE,
    );

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(sopInstanceUid);
    };

    const { mutate: restoreDicomInstance } = useMutation({
        ...restoreDicomInstanceMutation({
            workspaceId,
            instanceIds: [sopInstanceUid],
        }),
        onMutate: () => {
            toast.loading(
                t("dicom.messages.restoring", { level: "instance" }),
                {
                    id: `restore-${sopInstanceUid}`,
                },
            );
        },
        onSuccess: () => {
            toast.success(
                t("dicom.messages.restoreSuccess", { level: "instance" }),
            );
            toast.dismiss(`restore-${sopInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
        },
        onError: () => {
            toast.error(
                t("dicom.messages.restoreError", { level: "instance" }),
            );
            toast.dismiss(`restore-${sopInstanceUid}`);
        },
    });

    const { mutate: deleteDicomInstance } = useMutation({
        ...deleteDicomInstanceMutation({
            workspaceId,
            instanceIds: [sopInstanceUid],
        }),
        onMutate: () => {
            toast.loading(t("dicom.messages.deleting", { level: "instance" }), {
                id: `delete-${sopInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success(
                t("dicom.messages.deleteSuccess", { level: "instance" }),
            );
            toast.dismiss(`delete-${sopInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
        },
        onError: () => {
            toast.error(t("dicom.messages.deleteError", { level: "instance" }));
            toast.dismiss(`delete-${sopInstanceUid}`);
        },
    });

    const handleRestoreInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canDelete) {
            toast.error(
                t("dicom.messages.noPermissionRestore", { level: "instance" }),
            );
            return;
        }

        e.preventDefault();
        restoreDicomInstance();
    };

    const handleDeleteInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canDelete) {
            toast.error(
                t("dicom.messages.noPermissionDelete", { level: "instance" }),
            );
            return;
        }

        e.preventDefault();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (!canDelete) {
            toast.error(
                t("dicom.messages.noPermissionDelete", { level: "instance" }),
            );
            return;
        }

        deleteDicomInstance();
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
                        <DropdownMenuItem onClick={handleCopySopInstanceUid}>
                            {t("dicom.contextMenu.copy")}{" "}
                            {t("dicom.columns.instance.sopInstanceUid")}
                        </DropdownMenuItem>
                    )}

                    {canDelete && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleRestoreInstance}>
                                {t("dicom.contextMenu.restore")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteInstance}>
                                {t("dicom.contextMenu.delete")}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {canDelete && (
                <DicomDeleteConfirmDialog
                    open={showDeleteConfirmDialog}
                    onOpenChange={setShowDeleteConfirmDialog}
                    dicomLevel="instance"
                    selectedCount={1}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}

export function DicomRecycleInstancesDataTable({
    instances,
    workspaceId,
    className,
}: DicomRecycleInstancesTableProps) {
    const { t } = useT("translation");
    const {
        toggleInstanceSelection,
        isInstanceSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectInstance,
    } = useDicomInstanceSelectionStore();

    const generalColumns = useMemo(() => createInstanceColumns(t), [t]);

    const columns: ColumnDef<DicomInstanceData>[] = useMemo(
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
                                                row.original["00080018"]
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
                    const sopInstanceUid =
                        row.original["00080018"]?.Value?.[0] || "";
                    const isSelected = isInstanceSelected(sopInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleInstanceSelection(sopInstanceUid, true);
                            }}
                            aria-label="Select instance"
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
                            sopInstanceUid={
                                row.original["00080018"]?.Value?.[0] || "N/A"
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
                            workspaceId={workspaceId}
                            instance={row.original}
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
            isInstanceSelected,
            toggleInstanceSelection,
            generalColumns,
            t,
        ],
    );

    const table = useReactTable({
        data: instances,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false,
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        instance: DicomInstanceData,
    ) => {
        const sopInstanceUid = instance["00080018"]?.Value?.[0] || "";

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
        toggleInstanceSelection(sopInstanceUid, true);
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
                                const sopInstanceUid =
                                    row.original["00080018"]?.Value?.[0] || "";
                                const isSelected =
                                    isInstanceSelected(sopInstanceUid);

                                return (
                                    <DicomRecycleInstanceContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                    >
                                        <TableRow
                                            data-dicom-card
                                            onClick={(e) =>
                                                handleRowClick(e, row.original)
                                            }
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50",
                                            )}
                                            onContextMenu={() => {
                                                if (getSelectedCount() === 0) {
                                                    selectInstance(
                                                        sopInstanceUid,
                                                    );
                                                } else if (
                                                    getSelectedCount() === 1
                                                ) {
                                                    clearSelection();
                                                    selectInstance(
                                                        sopInstanceUid,
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
                                    </DicomRecycleInstanceContextMenu>
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
