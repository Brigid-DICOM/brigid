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
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomStudyMutation } from "@/react-query/queries/dicomStudy";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { ShareManagementDialog } from "../share/share-management-dialog";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";
import { CreateTagDialog } from "./tag/create-tag-dialog";
import { TagContextMenuSub } from "./tag/tag-context-menu-sub";

interface DicomStudyContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
}

export function DicomStudyContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
}: DicomStudyContextMenuProps) {
    const router = useRouter();
    const queryClient = getQueryClient();
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] =
        useState(false);
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const [showShareManagementDialog, setShowShareManagementDialog] =
        useState(false);
    const { open } = useBlueLightViewerStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    console.log(workspace);

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

    const { getSelectedStudyIds, clearSelection } =
        useDicomStudySelectionStore();
    const selectedIds = getSelectedStudyIds();

    const { mutate: recycleSelectedStudies } = useMutation({
        ...recycleDicomStudyMutation({
            workspaceId,
            studyIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM studies...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM studies recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM studies");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleEnterSeries = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        router.push(`/${workspaceId}/dicom-studies/${studyInstanceUid}`);
    };

    const handleDownloadThis = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        try {
            await downloadStudy(workspaceId, studyInstanceUid);
        } catch (error) {
            console.error("Failed to download this study", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download this study");
        }
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedStudyIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one study to download");
            return;
        }

        try {
            if (currentSelectedIds.length === 1) {
                await downloadStudy(workspaceId, currentSelectedIds[0]);
            } else {
                await downloadMultipleStudies(workspaceId, currentSelectedIds);
            }
        } catch (error) {
            console.error("Failed to download selected studies", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected studies");
        }
    };

    const handleRecycleSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        if (!canRecycle) {
            toast.error("You do not have permission to recycle DICOM studies");
            return;
        }

        e.preventDefault();
        closeContextMenu();
        setShowRecycleConfirmDialog(true);
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error("You do not have permission to recycle DICOM studies");
            return;
        }

        recycleSelectedStudies();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        open({
            studyInstanceUid,
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
                                        onClick={handleEnterSeries}
                                        className="flex items-center space-x-2"
                                    >
                                        <CornerDownLeftIcon className="size-4" />
                                        <span>Enter Series</span>
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
                                        targetId={studyInstanceUid}
                                        targetType="study"
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
                                        onClick={handleRecycleSelected}
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

                            <ContextMenuItem
                                onClick={handleDownloadSelected}
                                className="flex items-center space-x-2"
                            >
                                <DownloadIcon className="size-4" />
                                <span>Download</span>
                            </ContextMenuItem>

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
                                        onClick={handleRecycleSelected}
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
                    dicomLevel={"study"}
                    selectedCount={selectedIds.length}
                    onConfirm={handleConfirmRecycle}
                />
            )}

            {canUpdate && (
                <CreateTagDialog
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    workspaceId={workspaceId}
                    targetId={studyInstanceUid}
                    targetType="study"
                />
            )}

            {canShare && (
                <ShareManagementDialog
                    open={showShareManagementDialog}
                    onOpenChange={setShowShareManagementDialog}
                    workspaceId={workspaceId}
                    targetType="study"
                    targetIds={selectedIds}
                />
            )}
        </>
    );
}
