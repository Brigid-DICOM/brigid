"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CornerDownLeftIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "nextjs-toploader/app";
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
    deleteDicomSeriesMutation,
    restoreDicomSeriesMutation,
} from "@/react-query/queries/dicomSeries";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { DicomDeleteConfirmDialog } from "./dicom-delete-confirm-dialog";

interface DicomRecycleSeriesContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
}

export function DicomRecycleSeriesContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
}: DicomRecycleSeriesContextMenuProps) {
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const router = useRouter();
    const queryClient = getQueryClient();
    const { getSelectedSeriesIds, clearSelection } =
        useDicomSeriesSelectionStore();
    const selectedIds = getSelectedSeriesIds();

    const { data: workspaceData } = useQuery(
        getWorkspaceByIdQuery(workspaceId),
    );
    const canRestore = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.DELETE,
    );
    const canDelete = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.DELETE,
    );

    const { mutate: restoreDicomSeries } = useMutation({
        ...restoreDicomSeriesMutation({
            workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Restoring DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series restored successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to restore DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const { mutate: deleteDicomSeries } = useMutation({
        ...deleteDicomSeriesMutation({
            workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Deleting DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series deleted successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to delete DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        clearSelection();
        router.push(
            `/${workspaceId}/dicom-recycle/studies/${studyInstanceUid}/series/${selectedIds[0]}/instances`,
        );
    };

    const handleRestoreSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        restoreDicomSeries();
    };

    const handleDeleteSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIds.length === 0) return;
        deleteDicomSeries();
    };

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
                        onClick={handleEnterInstances}
                        className="flex items-center space-x-2"
                    >
                        <CornerDownLeftIcon className="size-4" />
                        <span>Enter Instances</span>
                    </ContextMenuItem>

                    {canRestore && (
                        <ContextMenuItem
                            onClick={handleRestoreSeries}
                            className="flex items-center space-x-2"
                        >
                            <UndoIcon className="size-4" />
                            <span>Restore</span>
                        </ContextMenuItem>
                    )}

                    {canDelete && (
                        <ContextMenuItem
                            onClick={handleDeleteSeries}
                            className="flex items-center space-x-2"
                        >
                            <Trash2Icon className="size-4" />
                            <span>Delete</span>
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canDelete && (
                <DicomDeleteConfirmDialog
                    open={showDeleteConfirmDialog}
                    onOpenChange={setShowDeleteConfirmDialog}
                    dicomLevel="series"
                    selectedCount={selectedIds.length}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}
