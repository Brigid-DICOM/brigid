"use client";

import type { DicomStudyData } from "@brigid/types";
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
import { createStudyColumns } from "@/components/dicom/data-tables/table-study-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDataTableTagCell } from "@/components/dicom/dicom-data-table-tag-cell";
import { DicomStudyContextMenu } from "@/components/dicom/dicom-study-context-menu";
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
import { downloadStudy } from "@/lib/clientDownload";
import { closeDropdownMenu, cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomStudyMutation } from "@/react-query/queries/dicomStudy";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useCreateTagDialogStore } from "@/stores/create-tag-dialog-store";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomStudiesTableProps {
    studies: DicomStudyData[];
    workspaceId: string;
    className?: string;
}

function ActionsCell({
    study,
    workspaceId,
}: {
    study: DicomStudyData;
    workspaceId: string;
}) {
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const router = useRouter();
    const { clearSelection, deselectStudy } = useDicomStudySelectionStore();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const { openDialog: openShareManagementDialog } =
        useShareManagementDialogStore();
    const { openDialog: openCreateTagDialog } = useCreateTagDialogStore();
    const { openDialog: openDicomRecycleConfirmDialog } =
        useDicomRecycleConfirmDialogStore();
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";
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
            WORKSPACE_PERMISSIONS.MANAGE,
        );

    const { mutate: recycleDicomStudy } = useMutation({
        ...recycleDicomStudyMutation({
            workspaceId,
            studyIds: [studyInstanceUid],
        }),
        onMutate: () => {
            toast.loading(t("dicom.messages.recycling", { level: "study" }), {
                id: `recycle-${studyInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success(
                t("dicom.messages.recycleSuccess", { level: "study" }),
            );
            toast.dismiss(`recycle-${studyInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            deselectStudy(studyInstanceUid);
        },
        onError: () => {
            toast.error(t("dicom.messages.recycleError", { level: "study" }));
            toast.dismiss(`recycle-${studyInstanceUid}`);
        },
    });

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(`/${lng}/${workspaceId}/dicom-studies/${studyInstanceUid}`);
    };

    const handleCopyStudyInstanceUid = (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.stopPropagation();
        navigator.clipboard.writeText(studyInstanceUid);
    };

    const handleDownloadStudy = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadStudy(workspaceId, studyInstanceUid);
    };

    const handleRecycleStudy = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "studies" }),
            );
            return;
        }

        e.stopPropagation();
        openDicomRecycleConfirmDialog({
            dicomLevel: "study",
            selectedCount: 1,
            onConfirm: handleConfirmRecycle,
        });
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "studies" }),
            );
            return;
        }

        recycleDicomStudy();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            studyInstanceUid,
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="size-8 p-0">
                    <span className="sr-only">
                        {t("dicom.contextMenu.openMenu")}
                    </span>
                    <MoreHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {canRead && (
                    <>
                        <DropdownMenuItem onClick={handleCopyStudyInstanceUid}>
                            {t("dicom.contextMenu.copy")}{" "}
                            {t("dicom.columns.study.studyInstanceUid")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleEnterSeries}>
                            {t("dicom.contextMenu.enterSeries")}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleOpenBlueLightViewer}>
                            {t("dicom.contextMenu.openInBlueLight")}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={handleDownloadStudy}>
                            {t("dicom.contextMenu.download")}
                        </DropdownMenuItem>
                    </>
                )}

                {canUpdate && (
                    <>
                        <DropdownMenuSeparator />

                        <TagDropdownSub
                            workspaceId={workspaceId}
                            targetId={studyInstanceUid}
                            targetType="study"
                            onOpenCreateTagDialog={() =>
                                openCreateTagDialog({
                                    workspaceId,
                                    targetType: "study",
                                    targetId: studyInstanceUid,
                                })
                            }
                        />
                    </>
                )}

                {canShare && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                closeDropdownMenu();
                                openShareManagementDialog({
                                    workspaceId,
                                    targetType: "study",
                                    targetIds: [studyInstanceUid],
                                });
                            }}
                        >
                            {t("dicom.contextMenu.share")}
                        </DropdownMenuItem>
                    </>
                )}

                {canRecycle && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={handleRecycleStudy}>
                            {t("dicom.contextMenu.recycle")}
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DicomStudiesDataTable({
    studies,
    workspaceId,
    className,
}: DicomStudiesTableProps) {
    const { t } = useT("translation");
    const {
        toggleStudySelection,
        isStudySelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectStudy,
    } = useDicomStudySelectionStore();

    const generalColumns = useMemo(() => createStudyColumns(t), [t]);

    const columns: ColumnDef<DicomStudyData>[] = useMemo(
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
                                                row.original["0020000D"]
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
                header: t("dicom.columns.preview"),
                cell: ({ row }) => {
                    return (
                        <TableThumbnailCell
                            source={{
                                type: "workspace",
                                workspaceId,
                            }}
                            studyInstanceUid={
                                row.original["0020000D"]?.Value?.[0] || ""
                            }
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
                            targetType="study"
                            targetId={
                                row.original["0020000D"]?.Value?.[0] || ""
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
                            study={row.original}
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
            isStudySelected,
            toggleStudySelection,
            generalColumns,
            t,
        ],
    );

    const table = useReactTable({
        data: studies,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false,
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        study: DicomStudyData,
    ) => {
        const studyInstanceUid = study["0020000D"]?.Value?.[0] || "";

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
                                    <DicomStudyContextMenu
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
                                                    selectStudy(
                                                        studyInstanceUid,
                                                    );
                                                } else if (
                                                    getSelectedCount() === 1
                                                ) {
                                                    clearSelection();
                                                    selectStudy(
                                                        studyInstanceUid,
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
                                    </DicomStudyContextMenu>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("dicom.messages.noData", {
                                        level: "studies",
                                    })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
