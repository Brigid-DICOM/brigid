"use client";

import { useMutation } from "@tanstack/react-query";
import {
    CopyIcon,
    DownloadIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
} from "lucide-react";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import {
    downloadInstance,
    downloadInstanceAsJpg,
    downloadInstanceAsPng,
    downloadMultipleInstances,
    downloadMultipleInstancesAsJpg,
    downloadMultipleInstancesAsPng,
} from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomInstanceMutation } from "@/react-query/queries/dicomInstance";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { CreateTagDialog } from "./tag/create-tag-dialog";
import { TagContextMenuSub } from "./tag/tag-context-menu-sub";

interface DicomInstanceContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
}

const DownloadSubMenuItems = ({
    onDicomDownload,
    onJpgDownload,
    onPngDownload,
}: {
    onDicomDownload: () => void;
    onJpgDownload: () => void;
    onPngDownload: () => void;
}) => {
    return (
        <>
            <ContextMenuItem
                onClick={onDicomDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>DICOM</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onJpgDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>JPG</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onPngDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>PNG</span>
            </ContextMenuItem>
        </>
    );
};

export function DicomInstanceContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
}: DicomInstanceContextMenuProps) {
    const { t } = useT("translation");
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const queryClient = getQueryClient();
    const { getSelectedInstanceIds, clearSelection } =
        useDicomInstanceSelectionStore();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const { openDialog: openShareManagementDialog } =
        useShareManagementDialogStore();
    const { openDialog: openDicomRecycleConfirmDialog } =
        useDicomRecycleConfirmDialogStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

    const canRead =
        !!workspace &&
        hasPermission(
            workspace.membership?.permissions ?? 0,
            WORKSPACE_PERMISSIONS.READ,
        );
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

    const selectedIds = getSelectedInstanceIds();

    const { handleDownload: handleDicomDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstance(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstances(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: t("dicom.messages.downloadError", { level: "instance" }),
    });

    const { handleDownload: handleJpgDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: t("dicom.messages.downloadInstanceImageError", {
            format: "JPG",
        }),
    });

    const { handleDownload: handlePngDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: t("dicom.messages.downloadInstanceImageError", {
            format: "PNG",
        }),
    });

    const { mutate: recycleDicomInstance } = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading(
                t("dicom.messages.recycling", { level: "instances" }),
                {
                    id: context.meta?.toastId as string,
                },
            );
        },
        onSuccess: (_, __, ___, context) => {
            toast.success(
                t("dicom.messages.recycleSuccess", { level: "instances" }),
            );
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
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
            toast.error(
                t("dicom.messages.recycleError", { level: "instances" }),
            );
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        openBlueLightViewer({
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        });
    };

    const handleRecycle = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "instances" }),
            );
            return;
        }

        e.preventDefault();
        closeContextMenu();
        openDicomRecycleConfirmDialog({
            dicomLevel: "instance",
            selectedCount: selectedIds.length,
            onConfirm: handleConfirmRecycle,
        });
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "instances" }),
            );
            return;
        }

        recycleDicomInstance();
    };

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        navigator.clipboard.writeText(sopInstanceUid);
        toast.success(
            t("dicom.messages.copiedToClipboard", { level: "sopInstanceUid" }),
        );
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-60">
                    {selectedIds.length === 1 && (
                        <>
                            {canRead && (
                                <>
                                    <ContextMenuItem
                                        onClick={handleCopySopInstanceUid}
                                        className="flex items-center space-x-2"
                                    >
                                        <CopyIcon className="size-4" />
                                        <span>
                                            {t("dicom.contextMenu.copy")}{" "}
                                            {t(
                                                "dicom.columns.instance.sopInstanceUid",
                                            )}
                                        </span>
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                        onClick={handleOpenBlueLightViewer}
                                        className="flex items-center space-x-2"
                                    >
                                        <EyeIcon className="size-4" />
                                        <span>
                                            {t(
                                                "dicom.contextMenu.openInBlueLight",
                                            )}
                                        </span>
                                    </ContextMenuItem>
                                    <ContextMenuSub>
                                        <ContextMenuSubTrigger>
                                            <DownloadIcon className="size-4 mr-4" />
                                            <span>
                                                {t(
                                                    "dicom.contextMenu.download",
                                                )}
                                            </span>
                                        </ContextMenuSubTrigger>
                                        <ContextMenuSubContent>
                                            <DownloadSubMenuItems
                                                onDicomDownload={() => {
                                                    closeContextMenu();
                                                    handleDicomDownload(
                                                        selectedIds,
                                                    );
                                                }}
                                                onJpgDownload={() => {
                                                    closeContextMenu();
                                                    handleJpgDownload(
                                                        selectedIds,
                                                    );
                                                }}
                                                onPngDownload={() => {
                                                    closeContextMenu();
                                                    handlePngDownload(
                                                        selectedIds,
                                                    );
                                                }}
                                            />
                                        </ContextMenuSubContent>
                                    </ContextMenuSub>
                                </>
                            )}

                            {canUpdate && (
                                <>
                                    <ContextMenuSeparator />

                                    <TagContextMenuSub
                                        workspaceId={workspaceId}
                                        targetType="instance"
                                        targetId={sopInstanceUid}
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
                                            openShareManagementDialog({
                                                workspaceId,
                                                targetType: "instance",
                                                targetIds: selectedIds,
                                            });
                                        }}
                                    >
                                        <Share2Icon className="size-4" />
                                        <span>
                                            {t("dicom.contextMenu.share")}
                                        </span>
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
                                        <span>
                                            {t("dicom.contextMenu.recycle")}
                                        </span>
                                    </ContextMenuItem>
                                </>
                            )}
                        </>
                    )}

                    {selectedIds.length > 1 && (
                        <>
                            <ContextMenuLabel>
                                {t("dicom.contextMenu.selectedItems", {
                                    count: selectedIds.length,
                                })}
                            </ContextMenuLabel>

                            {canRead && (
                                <ContextMenuSub>
                                    <ContextMenuSubTrigger>
                                        <DownloadIcon className="size-4 mr-2" />
                                        <span>
                                            {t("dicom.contextMenu.download")}
                                        </span>
                                    </ContextMenuSubTrigger>
                                    <ContextMenuSubContent>
                                        <DownloadSubMenuItems
                                            onDicomDownload={() => {
                                                closeContextMenu();
                                                handleDicomDownload(
                                                    selectedIds,
                                                );
                                            }}
                                            onJpgDownload={() => {
                                                closeContextMenu();
                                                handleJpgDownload(selectedIds);
                                            }}
                                            onPngDownload={() => {
                                                closeContextMenu();
                                                handlePngDownload(selectedIds);
                                            }}
                                        />
                                    </ContextMenuSubContent>
                                </ContextMenuSub>
                            )}

                            {canShare && (
                                <>
                                    <ContextMenuSeparator />

                                    <ContextMenuItem
                                        className="flex items-center space-x-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            closeContextMenu();
                                            openShareManagementDialog({
                                                workspaceId,
                                                targetType: "instance",
                                                targetIds: selectedIds,
                                            });
                                        }}
                                    >
                                        <Share2Icon className="size-4" />
                                        <span>
                                            {t("dicom.contextMenu.share")}
                                        </span>
                                    </ContextMenuItem>
                                </>
                            )}

                            {canRecycle && (
                                <>
                                    <ContextMenuSeparator />

                                    <ContextMenuItem
                                        onClick={handleRecycle}
                                        className="flex items-center"
                                    >
                                        <Trash2Icon className="size-4" />
                                        <span>
                                            {t("dicom.contextMenu.recycle")}
                                        </span>
                                    </ContextMenuItem>
                                </>
                            )}
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canUpdate && (
                <CreateTagDialog
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    workspaceId={workspaceId}
                    targetType="instance"
                    targetId={sopInstanceUid}
                />
            )}
        </>
    );
}
