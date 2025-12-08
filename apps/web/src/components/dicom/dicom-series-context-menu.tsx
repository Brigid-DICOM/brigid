"use client";

import { useMutation } from "@tanstack/react-query";
import {
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomSeriesMutation } from "@/react-query/queries/dicomSeries";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ShareManagementDialog } from "../share/share-management-dialog";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";
import { CreateTagDialog } from "./tag/create-tag-dialog";
import { TagContextMenuSub } from "./tag/tag-context-menu-sub";

interface DicomSeriesContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
}

export function DicomSeriesContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
}: DicomSeriesContextMenuProps) {
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] =
        useState(false);
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const [showShareManagementDialog, setShowShareManagementDialog] =
        useState(false);
    const queryClient = getQueryClient();
    const router = useRouter();
    const { getSelectedSeriesIds, clearSelection } =
        useDicomSeriesSelectionStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const { open } = useBlueLightViewerStore();
    const selectedIds = getSelectedSeriesIds();

    const canRecycle =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.DELETE,
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
    const canRead =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.READ,
        );

    const { mutate: recycleDicomSeries } = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleEnterInstances = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();
        router.push(
            `/${workspaceId}/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`,
        );
    };

    const handleDownloadThis = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        try {
            await downloadSeries(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
            );
        } catch (error) {
            console.error("Failed to download this series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download this series");
        }
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedSeriesIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one series to download");
            return;
        }

        try {
            if (currentSelectedIds.length === 1) {
                await downloadSeries(
                    workspaceId,
                    studyInstanceUid,
                    currentSelectedIds[0],
                );
            } else {
                await downloadMultipleSeries(
                    workspaceId,
                    studyInstanceUid,
                    currentSelectedIds,
                );
            }
        } catch (error) {
            console.error("Failed to download selected series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected series");
        }
    };

    const handleRecycle = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error("You do not have permission to recycle DICOM series");
            return;
        }

        e.preventDefault();
        closeContextMenu();
        setShowRecycleConfirmDialog(true);
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error("You do not have permission to recycle DICOM series");
            return;
        }

        recycleDicomSeries();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        open({
            studyInstanceUid,
            seriesInstanceUid,
        });
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-56">
                    {selectedIds.length === 1 && (
                        <>
                            {canRead && (
                                <>
                                    <ContextMenuItem
                                        onClick={handleEnterInstances}
                                        className="flex items-center space-x-2"
                                    >
                                        <CornerDownLeftIcon className="size-4" />
                                        <span>Enter Instances</span>
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                        onClick={handleOpenBlueLightViewer}
                                        className="flex items-center space-x-2"
                                    >
                                        <EyeIcon className="size-4" />
                                        <span>Open in BlueLight Viewer</span>
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                        onClick={handleDownloadThis}
                                        className="flex items-center space-x-2"
                                    >
                                        <DownloadIcon className="size-4" />
                                        <span>Download</span>
                                    </ContextMenuItem>
                                </>
                            )}

                            {canUpdate && (
                                <>
                                    <ContextMenuSeparator />

                                    <TagContextMenuSub
                                        workspaceId={workspaceId}
                                        targetId={seriesInstanceUid}
                                        targetType="series"
                                        onOpenCreateTagDialog={() =>
                                            setOpenCreateTagDialog(true)
                                        }
                                    />
                                </>
                            )}

                            {canShare && (
                                <>
                                    <ContextMenuSeparator />

                                    <ContextMenuItem
                                        className="flex items-center space-x-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            closeContextMenu();
                                            setShowShareManagementDialog(true);
                                        }}
                                    >
                                        <Share2Icon className="size-4" />
                                        <span>Share</span>
                                    </ContextMenuItem>
                                </>
                            )}

                            {canRecycle && (
                                <>
                                    <ContextMenuSeparator />

                                    <ContextMenuItem
                                        onClick={handleRecycle}
                                        className="flex items-center space-x-2"
                                    >
                                        <Trash2Icon className="size-4" />
                                        <span>Recycle</span>
                                    </ContextMenuItem>
                                </>
                            )}
                        </>
                    )}

                    {selectedIds.length > 1 && (
                        <>
                            <ContextMenuLabel>
                                Selected Items ({selectedIds.length})
                            </ContextMenuLabel>

                            {canRead && (
                                <ContextMenuItem
                                    onClick={handleDownloadSelected}
                                    className="flex items-center space-x-2"
                                >
                                    <DownloadIcon className="size-4" />
                                    <span>Download</span>
                                </ContextMenuItem>
                            )}

                            {canShare && (
                                <>
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                        className="flex items-center space-x-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            closeContextMenu();
                                            setShowShareManagementDialog(true);
                                        }}
                                    >
                                        <Share2Icon className="size-4" />
                                        <span>Share</span>
                                    </ContextMenuItem>
                                </>
                            )}

                            {canRecycle && (
                                <>
                                    <ContextMenuSeparator />

                                    <ContextMenuItem
                                        onClick={handleRecycle}
                                        className="flex items-center space-x-2"
                                    >
                                        <Trash2Icon className="size-4" />
                                        <span>Recycle</span>
                                    </ContextMenuItem>
                                </>
                            )}
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canRecycle && (
                <DicomRecycleConfirmDialog
                    open={showRecycleConfirmDialog}
                    onOpenChange={setShowRecycleConfirmDialog}
                    dicomLevel={"series"}
                    selectedCount={selectedIds.length}
                    onConfirm={handleConfirmRecycle}
                />
            )}

            {canUpdate && (
                <CreateTagDialog
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    workspaceId={workspaceId}
                    targetType="series"
                    targetId={seriesInstanceUid}
                />
            )}

            {canShare && (
                <ShareManagementDialog
                    open={showShareManagementDialog}
                    onOpenChange={setShowShareManagementDialog}
                    workspaceId={workspaceId}
                    targetType="series"
                    targetIds={selectedIds}
                />
            )}
        </>
    );
}
