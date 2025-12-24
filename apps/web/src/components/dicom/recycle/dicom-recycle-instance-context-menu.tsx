"use client";

import { useQuery } from "@tanstack/react-query";
import { Trash2Icon, UndoIcon } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useInstanceRecycleActions } from "@/hooks/dicom-recycle/use-instance-recycle-actions";
import { closeContextMenu } from "@/lib/utils";
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
    const { getSelectedInstanceIds } =
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

    const { restoreInstance, deleteInstance, setInstanceIds: setRecycleInstanceIds } = useInstanceRecycleActions({
        workspaceId,
        studyInstanceUid,
        seriesInstanceUid,
    });

    const handleRestore = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        setRecycleInstanceIds(selectedIds);
        restoreInstance();
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIds.length === 0) return;

        setRecycleInstanceIds(selectedIds);
        deleteInstance();
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
