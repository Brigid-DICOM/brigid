"use client";

import { useQuery } from "@tanstack/react-query";
import { CornerDownLeftIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
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
import { useSeriesRecycleActions } from "@/hooks/dicom-recycle/use-series-recycle-actions";
import { closeContextMenu } from "@/lib/utils";
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
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] =
        useState(false);
    const router = useRouter();
    
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

    const { restoreSeries, deleteSeries, setSeriesIds: setRecycleSeriesIds } = useSeriesRecycleActions({
        workspaceId,
        studyInstanceUid,
    });

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        clearSelection();
        router.push(
            `/${lng}/${workspaceId}/dicom-recycle/studies/${studyInstanceUid}/series/${selectedIds[0]}/instances`,
        );
    };

    const handleRestoreSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        
        setRecycleSeriesIds(selectedIds);
        restoreSeries();
    };

    const handleDeleteSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteConfirmDialog(true);
    };

    const handleConfirmDelete = () => {
        if (selectedIds.length === 0) return;

        setRecycleSeriesIds(selectedIds);
        deleteSeries();
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

                    <ContextMenuItem
                        onClick={handleEnterInstances}
                        className="flex items-center space-x-2"
                    >
                        <CornerDownLeftIcon className="size-4" />
                        <span>{t("dicom.contextMenu.enterInstances")}</span>
                    </ContextMenuItem>

                    {canRestore && (
                        <ContextMenuItem
                            onClick={handleRestoreSeries}
                            className="flex items-center space-x-2"
                        >
                            <UndoIcon className="size-4" />
                            <span>{t("dicom.contextMenu.restore")}</span>
                        </ContextMenuItem>
                    )}

                    {canDelete && (
                        <ContextMenuItem
                            onClick={handleDeleteSeries}
                            className="flex items-center space-x-2"
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
                    dicomLevel="series"
                    selectedCount={selectedIds.length}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}
