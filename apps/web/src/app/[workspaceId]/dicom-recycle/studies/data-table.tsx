"use client";

import type { DicomStudyData } from "@brigid/types";
import { useMutation } from "@tanstack/react-query";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { createStudyColumns } from "@/components/dicom/data-tables/table-study-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDeleteConfirmDialog } from "@/components/dicom/recycle/dicom-delete-confirm-dialog";
import { DicomRecycleStudyContextMenu } from "@/components/dicom/recycle/dicom-recycle-study-context-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
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
    deleteDicomStudyMutation, restoreDicomStudyMutation
 } from "@/react-query/queries/dicomStudy";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

interface DicomRecycleStudiesTableProps {
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
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const queryClient = getQueryClient();
    const router = useRouter();
    const { clearSelection, deselectStudy } = useDicomStudySelectionStore();
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";
    const workspace = useWorkspaceStore(useShallow(state => state.workspace));

    const canRead = hasPermission(workspace?.membership?.permissions ?? 0, WORKSPACE_PERMISSIONS.READ);
    const canDelete = hasPermission(workspace?.membership?.permissions ?? 0, WORKSPACE_PERMISSIONS.DELETE);

    const { mutate: restoreDicomStudy } = useMutation({
        ...restoreDicomStudyMutation({
            workspaceId,
            studyIds: [studyInstanceUid],
        }),
        onMutate: () => {
            toast.loading("Restoring DICOM study...", {
                id: `restore-${studyInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success("DICOM study restored successfully");
            toast.dismiss(`restore-${studyInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            deselectStudy(studyInstanceUid);
        },
        onError: () => {
            toast.error("Failed to restore DICOM study");
            toast.dismiss(`restore-${studyInstanceUid}`);
        },
    });

    const { mutate: deleteDicomStudy } = useMutation({
        ...deleteDicomStudyMutation({
            workspaceId,
            studyIds: [studyInstanceUid],
        }),
        onMutate: () => {
            toast.loading("Deleting DICOM study...", {
                id: `delete-${studyInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success("DICOM study deleted successfully");
            toast.dismiss(`delete-${studyInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            deselectStudy(studyInstanceUid);
        },
        onError: () => {
            toast.error("Failed to delete DICOM study");
            toast.dismiss(`delete-${studyInstanceUid}`);
        },
    });

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        router.push(`/${workspaceId}/dicom-recycle/studies/${studyInstanceUid}/series`);
    };
    
    const handleCopyStudyInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(studyInstanceUid);
    }

    const handleRestoreStudy = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        restoreDicomStudy();
    }

    const handleDeleteStudy = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setShowDeleteConfirmDialog(true);
    }

    const handleConfirmDelete = () => {
        deleteDicomStudy();
    }

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
                            <DropdownMenuItem onClick={handleCopyStudyInstanceUid}>
                                Copy Study Instance UID
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleEnterSeries}>
                                Enter Series
                            </DropdownMenuItem>
                        </>
                    )}

                    {canDelete && (
                        <>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleRestoreStudy}>
                                Restore
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDeleteStudy}>
                                Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <DicomDeleteConfirmDialog 
                open={showDeleteConfirmDialog}
                onOpenChange={setShowDeleteConfirmDialog}
                dicomLevel="study"
                selectedCount={1}
                onConfirm={handleConfirmDelete}
            />
        </>
    )
}

export function DicomRecycleStudiesDataTable({
    studies,
    workspaceId,
    className,
}: DicomRecycleStudiesTableProps) {
    const {
        toggleStudySelection,
        isStudySelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectStudy
    } = useDicomStudySelectionStore();

    const generalColumns = useMemo(() => createStudyColumns(), []);

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
                                                row.original["0020000D"]?.Value?.[0] || "",
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
                    const studyInstanceUid = row.original["0020000D"]?.Value?.[0] || "";
                    const isSelected = isStudySelected(studyInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleStudySelection(studyInstanceUid, true);
                            }}
                            aria-label="Select study"
                        />
                    )
                },
                enableSorting: false,
                enableHiding: false
            },
            {
                accessorKey: "thumbnail",
                header: "Preview",
                cell: ({ row }) => {
                    return (
                        <TableThumbnailCell
                            source={{
                                type: "workspace",
                                workspaceId,
                            }}
                            studyInstanceUid={row.original["0020000D"]?.Value?.[0] || "N/A"}
                        />
                    )
                }
            },
            ...generalColumns,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => {
                    return <ActionsCell study={row.original} workspaceId={workspaceId} />;
                }
            }
        ],
        [
            workspaceId,
            clearSelection,
            selectAll,
            getSelectedCount,
            isStudySelected,
            toggleStudySelection,
            generalColumns,
        ]
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
    }

    return (
        <div className={cn("w-full", className)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow  key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map(row => {
                                const studyInstanceUid = row.original["0020000D"]?.Value?.[0] || "";
                                const isSelected = isStudySelected(studyInstanceUid);

                                return (
                                    <DicomRecycleStudyContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
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
                                                    selectStudy(studyInstanceUid);
                                                } else if (getSelectedCount() === 1) {
                                                    clearSelection();
                                                    selectStudy(studyInstanceUid);
                                                }
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))

                                            }
                                        </TableRow>
                                    </DicomRecycleStudyContextMenu>
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