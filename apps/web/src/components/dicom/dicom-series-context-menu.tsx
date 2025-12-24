"use client";

import {
    CopyIcon,
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
    Share2Icon,
    Trash2Icon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useSeriesRecycleActions } from "@/hooks/dicom-recycle/use-series-recycle-actions";
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useCreateTagDialogStore } from "@/stores/create-tag-dialog-store";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { useWorkspaceStore } from "@/stores/workspace-store";
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
    const { t } = useT("translation");
    const { lng } = useParams<{ lng: string }>();
    const { openDialog: openCreateTagDialog } = useCreateTagDialogStore();
    const { openDialog: openShareManagementDialog } =
        useShareManagementDialogStore();
    const { openDialog: openDicomRecycleConfirmDialog } =
        useDicomRecycleConfirmDialogStore();
    const { open } = useBlueLightViewerStore();
    const router = useRouter();
    const { getSelectedSeriesIds } =
        useDicomSeriesSelectionStore();
    const workspace = useWorkspaceStore(useShallow((state) => state.workspace));

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

    const { recycleSeries, setSeriesIds: setRecycleSeriesIds } = useSeriesRecycleActions({
        workspaceId,
        studyInstanceUid,
    });

    const handleEnterInstances = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();
        router.push(
            `/${lng}/${workspaceId}/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`,
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
            console.error(
                t("dicom.messages.downloadError", { level: "series" }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(t("dicom.messages.downloadError", { level: "series" }));
        }
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedSeriesIds();

        if (currentSelectedIds.length === 0) {
            toast.error(
                t("dicom.messages.selectToDownload", { level: "series" }),
            );
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
            console.error(
                t("dicom.messages.downloadSelectedError", { level: "series" }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadSelectedError", { level: "series" }),
            );
        }
    };

    const handleRecycle = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "series" }),
            );
            return;
        }

        e.preventDefault();
        closeContextMenu();
        openDicomRecycleConfirmDialog({
            dicomLevel: "series",
            selectedCount: selectedIds.length,
            onConfirm: handleConfirmRecycle,
        });
    };

    const handleConfirmRecycle = () => {
        if (!canRecycle) {
            toast.error(
                t("dicom.messages.noPermissionRecycle", { level: "series" }),
            );
            return;
        }

        setRecycleSeriesIds(selectedIds);
        recycleSeries();
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        open({
            studyInstanceUid,
            seriesInstanceUid,
        });
    };

    const handleCopySeriesInstanceUid = (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();
        navigator.clipboard.writeText(seriesInstanceUid);
        toast.success(
            t("dicom.messages.copiedToClipboard", {
                level: "seriesInstanceUid",
            }),
        );
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

            <ContextMenuContent className="w-60">
                {selectedIds.length === 1 && (
                    <>
                        {canRead && (
                            <>
                                <ContextMenuItem
                                    onClick={handleCopySeriesInstanceUid}
                                    className="flex items-center space-x-2"
                                >
                                    <CopyIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.copy")}{" "}
                                        {t(
                                            "dicom.columns.series.seriesInstanceUid",
                                        )}
                                    </span>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleEnterInstances}
                                    className="flex items-center space-x-2"
                                >
                                    <CornerDownLeftIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.enterInstances")}
                                    </span>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleOpenBlueLightViewer}
                                    className="flex items-center space-x-2"
                                >
                                    <EyeIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.openInBlueLight")}
                                    </span>
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={handleDownloadThis}
                                    className="flex items-center space-x-2"
                                >
                                    <DownloadIcon className="size-4" />
                                    <span>
                                        {t("dicom.contextMenu.download")}
                                    </span>
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
                                        openCreateTagDialog({
                                            workspaceId,
                                            targetType: "series",
                                            targetId: seriesInstanceUid,
                                        })
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
                                            targetType: "series",
                                            targetIds: selectedIds,
                                        });
                                    }}
                                >
                                    <Share2Icon className="size-4" />
                                    <span>{t("dicom.contextMenu.share")}</span>
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
                            <ContextMenuItem
                                onClick={handleDownloadSelected}
                                className="flex items-center space-x-2"
                            >
                                <DownloadIcon className="size-4" />
                                <span>{t("dicom.contextMenu.download")}</span>
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
                                        openShareManagementDialog({
                                            workspaceId,
                                            targetType: "series",
                                            targetIds: selectedIds,
                                        });
                                    }}
                                >
                                    <Share2Icon className="size-4" />
                                    <span>{t("dicom.contextMenu.share")}</span>
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
            </ContextMenuContent>
        </ContextMenu>
    );
}
