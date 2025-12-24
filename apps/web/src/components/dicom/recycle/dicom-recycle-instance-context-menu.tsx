"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Trash2Icon, UndoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
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
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
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
    const { t } = useT("translation");
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const queryClient = getQueryClient();
    const { getSelectedInstanceIds, clearSelection } =
        useDicomInstanceSelectionStore();
    const selectedIds = getSelectedInstanceIds();

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

    const { mutate: restoreDicomInstance } = useMutation({
        ...restoreDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(t("dicom.message.restoring", { level: "instance" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(t("dicom.messages.restoreSuccess", { level: "instance" }));
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
            toast.error(t("dicom.messages.restoreError", { level: "instance" }));
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
            toast.loading(t("dicom.messages.deleting", { level: "instance" }), {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(t("dicom.messages.deleteSuccess", { level: "instance" }));
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
        },
        onError: (_, __, ___, context) => {
            toast.error(t("dicom.messages.deleteError", { level: "instance" }));
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
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-60">
                    {selectedIds.length > 1 && (
                        <ContextMenuLabel>
                            {t("dicom.contextMenu.selectedItems", {
                                count: selectedIds.length,
                            })}
                        </ContextMenuLabel>
                    )}

                    {canRestore && (
                        <ContextMenuItem
                            onClick={handleRestore}
                            className="flex items-center"
                        >
                            <UndoIcon className="size-4" />
                            <span>{t("dicom.contextMenu.restore")}</span>
                        </ContextMenuItem>
                    )}

                    {canDelete && (
                        <ContextMenuItem
                            onClick={handleDelete}
                            className="flex items-center"
                        >
                            <Trash2Icon className="size-4" />
                            <span>{t("dicom.contextMenu.delete")}</span>
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canDelete && (
                <DicomDeleteConfirmDialog
                    open={showDeleteConfirmDialog}
                    onOpenChange={setShowDeleteConfirmDialog}
                    dicomLevel="instance"
                    selectedCount={selectedIds.length}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}
