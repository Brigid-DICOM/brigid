"use client";

import { useMutation } from "@tanstack/react-query";
import { Trash2Icon, UndoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteDicomInstanceMutation,
    restoreDicomInstanceMutation,
} from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { DicomDeleteConfirmDialog } from "./dicom-delete-confirm-dialog";

interface DicomRecycleInstanceContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
}

export function DicomRecycleInstanceContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
}: DicomRecycleInstanceContextMenuProps) {
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const queryClient = getQueryClient();
    const { getSelectedInstanceIds, clearSelection } =
        useDicomInstanceSelectionStore();
    const selectedIds = getSelectedInstanceIds();

    const { mutate: restoreDicomInstance } = useMutation({
        ...restoreDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Restoring DICOM instance...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM instance restored successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to restore DICOM instance");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const { mutate: deleteDicomInstance } = useMutation({
        ...deleteDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Deleting DICOM instance...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM instance deleted successfully");
            toast.dismiss(context.meta?.toastId as string);
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to delete DICOM instance");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleRestore = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        restoreDicomInstance();
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIds.length === 0) return;
        deleteDicomInstance();
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-56">
                    {selectedIds.length > 1 && (
                        <ContextMenuLabel>
                            Selected Items ({selectedIds.length})
                        </ContextMenuLabel>
                    )}

                    <ContextMenuItem
                        onClick={handleRestore}
                        className="flex items-center"
                    >
                        <UndoIcon className="size-4" />
                        <span>Restore</span>
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={handleDelete}
                        className="flex items-center"
                    >
                        <Trash2Icon className="size-4" />
                        <span>Delete</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

            <DicomDeleteConfirmDialog 
                open={showDeleteConfirmDialog}
                onOpenChange={setShowDeleteConfirmDialog}
                dicomLevel="instance"
                selectedCount={selectedIds.length}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
