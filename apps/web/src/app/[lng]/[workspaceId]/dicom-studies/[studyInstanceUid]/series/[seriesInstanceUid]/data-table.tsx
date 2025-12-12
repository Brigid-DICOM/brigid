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
import { DicomDataTableTagCell } from "@/components/dicom/dicom-data-table-tag-cell";
import { DicomInstanceContextMenu } from "@/components/dicom/dicom-instance-context-menu";
import { DicomRecycleConfirmDialog } from "@/components/dicom/dicom-recycle-confirm-dialog";
import { CreateTagDialog } from "@/components/dicom/tag/create-tag-dialog";
import { TagDropdownSub } from "@/components/dicom/tag/tag-dropdown-sub";
import { ShareManagementDialog } from "@/components/share/share-management-dialog";
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
import { downloadInstance } from "@/lib/clientDownload";
import { closeDropdownMenu, cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomInstanceMutation } from "@/react-query/queries/dicomInstance";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomInstancesTableProps {
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
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] =
        useState(false);
    const [showShareManagementDialog, setShowShareManagementDialog] = useState(false);
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const queryClient = getQueryClient();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";

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

    const { mutate: recycleDicomInstance } = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds: [sopInstanceUid],
        }),
        onMutate: () => {
            toast.loading(t("dicom.messages.recyclingInstance", { level: "instance" }), {
                id: `recycle-${sopInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success(t("dicom.messages.instanceRecycled", { level: "instance" }));
            toast.dismiss(`recycle-${sopInstanceUid}`);
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
            toast.error(t("dicom.messages.failedToRecycleInstance", { level: "instance" }));
            toast.dismiss(`recycle-${sopInstanceUid}`);
        },
    });

    const handleDownloadInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadInstance(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        );
    };

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(sopInstanceUid);
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        });
    };

    const handleRecycleInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "instances" }),
            );
            return;
        }

        e.stopPropagation();
        setShowRecycleConfirmDialog(true);
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "instances" }),
            );
            return;
        }

        recycleDicomInstance();
    };

    return (
        <>
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
                                onClick={handleCopySopInstanceUid}
                            >
                                {t("dicom.contextMenu.copy")} {t("dicom.columns.instance.sopInstanceUid")}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={handleOpenBlueLightViewer}
                            >
                                {t("dicom.contextMenu.openInBlueLight")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleDownloadInstance}>
                                {t("dicom.contextMenu.download")}
                            </DropdownMenuItem>
                        </>
                    )}

                    {canUpdate && (
                        <>
                            <DropdownMenuSeparator />

                            <TagDropdownSub
                                workspaceId={workspaceId}
                                targetId={sopInstanceUid}
                                targetType="instance"
                                onOpenCreateTagDialog={() =>
                                    setOpenCreateTagDialog(true)
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
                                setShowShareManagementDialog(true);
                            }} >
                                {t("dicom.contextMenu.share")}
                            </DropdownMenuItem>
                        </>
                    )}

                    {canRecycle && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleRecycleInstance}>
                                {t("dicom.contextMenu.recycle")}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {canRecycle && (
                <DicomRecycleConfirmDialog
                    open={showRecycleConfirmDialog}
                    onOpenChange={setShowRecycleConfirmDialog}
                    dicomLevel={"instance"}
                    selectedCount={1}
                    onConfirm={handleConfirmRecycle}
                />
            )}

            {canUpdate && (
                <CreateTagDialog
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    workspaceId={workspaceId}
                    targetType="instance"
                    targetId={sopInstanceUid}
                />
            )}

            {canShare && (
                <ShareManagementDialog 
                    open={showShareManagementDialog}
                    onOpenChange={setShowShareManagementDialog}
                    workspaceId={workspaceId}
                    targetType="instance"
                    targetIds={[sopInstanceUid]}
                />
            )}
        </>
    );
}

export function DicomInstancesDataTable({
    instances,
    workspaceId,
    className,
}: DicomInstancesTableProps) {
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
                header: ({table}) => {
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
                                                row.original["00080018"]?.Value?.[0] ||
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
                header: t("dicom.columns.thumbnail"),
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
            {
                accessorKey: "tags",
                header: t("dicom.columns.tags"),
                cell: ({ row }) => {
                    return (
                        <DicomDataTableTagCell
                            mode="workspace"
                            workspaceId={workspaceId}
                            targetType="instance"
                            targetId={
                                row.original["00080018"]?.Value?.[0] || ""
                            }
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            ...generalColumns,
            {
                accessorKey: "actions",
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
            t
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
                                    <DicomInstanceContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                        sopInstanceUid={sopInstanceUid}
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
                                    </DicomInstanceContextMenu>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("dicom.messages.noData", { level: "instances" })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
