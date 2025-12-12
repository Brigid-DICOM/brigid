"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { CornerDownLeftIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
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
    deleteDicomStudyMutation,
    restoreDicomStudyMutation,
} from "@/react-query/queries/dicomStudy";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { DicomDeleteConfirmDialog } from "./dicom-delete-confirm-dialog";

interface DicomRecycleStudyContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
}

export function DicomRecycleStudyContextMenu({
    children,
    workspaceId,
}: DicomRecycleStudyContextMenuProps) {
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const router = useRouter();
    const queryClient = getQueryClient();
    const { getSelectedStudyIds, clearSelection } =
        useDicomStudySelectionStore();
    const selectedIds = getSelectedStudyIds();

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

    const { mutate: restoreStudies } = useMutation({
        ...restoreDicomStudyMutation({
            workspaceId,
            studyIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Restoring DICOM studies...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM studies restored successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to restore DICOM studies");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const { mutate: deleteStudies } = useMutation({
        ...deleteDicomStudyMutation({
            workspaceId,
            studyIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Deleting DICOM studies...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM studies deleted successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to delete DICOM studies");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        clearSelection();
        closeContextMenu();
        router.push(
            `/${lng}/${workspaceId}/dicom-recycle/studies/${selectedIds[0]}/series`,
        );
    };

    const handleRestoreStudies = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        restoreStudies();
    };

    const handleDeleteStudies = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIds.length === 0) return;
        deleteStudies();
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-60">
                    {selectedIds.length > 1 && (
                        <ContextMenuLabel>
                            {t("dicom.contextMenu.selectedItems", { count: selectedIds.length })}
                        </ContextMenuLabel>
                    )}

                    <ContextMenuItem
                        onClick={handleEnterSeries}
                        className="flex items-center space-x-2"
                    >
                        <CornerDownLeftIcon className="size-4" />
                        <span>{t("dicom.contextMenu.enterSeries")}</span>
                    </ContextMenuItem>

                    {canRestore && (
                        <ContextMenuItem
                            onClick={handleRestoreStudies}
                            className="flex items-center space-x-2"
                        >
                            <UndoIcon className="size-4" />
                            <span>{t("dicom.contextMenu.restore")}</span>
                        </ContextMenuItem>
                    )}

                    {canDelete && (
                        <ContextMenuItem
                            onClick={handleDeleteStudies}
                            className="flex items-center space-x-2"
                        >
                            <Trash2Icon className="size-4" />
                            <span>{t("dicom.contextMenu.delete")}</span>
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            <DicomDeleteConfirmDialog
                open={showDeleteConfirmDialog}
                onOpenChange={setShowDeleteConfirmDialog}
                dicomLevel="study"
                selectedCount={selectedIds.length}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
