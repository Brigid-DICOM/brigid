"use client";

import { CopyIcon, DownloadIcon, EyeIcon } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
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
import {
    downloadShareMultipleInstances,
    downloadShareMultipleInstancesAsJpg,
    downloadShareMultipleInstancesAsPng,
} from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useShareCreateTagDialogStore } from "@/stores/share-create-tag-dialog-store";
import { ShareTagContextMenuSub } from "./tag/share-tag-context-menu-sub";

interface SharedDicomInstanceContextMenuProps {
    children: React.ReactNode;
    token: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
    publicPermissions: number;
}

const DownloadSubMenuItems = ({
    onDicomDownload,
    onJpgDownload,
    onPngDownload,
}: {
    onDicomDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
    onJpgDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
    onPngDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
    const { t } = useT("translation");

    return (
        <>
            <ContextMenuItem
                onClick={onDicomDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4" />
                <span>{t("dicom.contextMenu.downloadFormat.dicom")}</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onJpgDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4" />
                <span>JPG</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onPngDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4" />
                <span>PNG</span>
            </ContextMenuItem>
        </>
    );
};

const DownloadSubMenu = ({
    onDicomDownload,
    onJpgDownload,
    onPngDownload,
}: {
    onDicomDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
    onJpgDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
    onPngDownload: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
    const { t } = useT("translation");

    return (
        <ContextMenuSub>
            <ContextMenuSubTrigger>
                <DownloadIcon className="size-4 mr-4" />
                <span>{t("dicom.contextMenu.download")}</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
                <DownloadSubMenuItems
                    onDicomDownload={onDicomDownload}
                    onJpgDownload={onJpgDownload}
                    onPngDownload={onPngDownload}
                />
            </ContextMenuSubContent>
        </ContextMenuSub>
    );
};

export function SharedDicomInstanceContextMenu({
    children,
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
    publicPermissions,
}: SharedDicomInstanceContextMenuProps) {
    const { t } = useT("translation");
    const { openDialog: openCreateTagDialog } = useShareCreateTagDialogStore();
    const { open } = useBlueLightViewerStore();

    const { getSelectedInstanceIds, clearSelection } =
        useDicomInstanceSelectionStore();
    const selectedIds = getSelectedInstanceIds();

    const canUpdate = hasPermission(
        publicPermissions,
        SHARE_PERMISSIONS.UPDATE,
    );

    const handleDicomDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        try {
            await downloadShareMultipleInstances(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
                password,
            );
        } catch (error) {
            console.error(
                t("dicom.messages.downloadSelectedError", {
                    level: "instances",
                }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadSelectedError", {
                    level: "instances",
                }),
            );
        }
    };

    const handleJpgDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        try {
            await downloadShareMultipleInstancesAsJpg(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
            );
        } catch (error) {
            console.error(
                t("dicom.messages.downloadInstanceImageError", {
                    format: "JPG",
                }),
                error,
            );

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadInstanceImageError", {
                    format: "JPG",
                }),
            );
        }
    };

    const handlePngDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        try {
            await downloadShareMultipleInstancesAsPng(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
            );
        } catch (error) {
            console.error(
                t("dicom.messages.downloadInstanceImageError", {
                    format: "PNG",
                }),
                error,
            );
            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(
                t("dicom.messages.downloadInstanceImageError", {
                    format: "PNG",
                }),
            );
        }
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        open({
            shareToken: token,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            password,
        });
    };

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        navigator.clipboard.writeText(sopInstanceUid);
        toast.success(
            t("dicom.messages.copiedToClipboard", { level: "sopInstanceUid" }),
        );
    };

    useEffect(() => {
        return () => {
            clearSelection();
        };
    }, [clearSelection]);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
            <ContextMenuContent className="w-60">
                {selectedIds.length === 1 && (
                    <>
                        <ContextMenuItem
                            onClick={handleCopySopInstanceUid}
                            className="flex items-center space-x-2"
                        >
                            <CopyIcon className="size-4" />
                            <span>
                                {t("dicom.contextMenu.copy")}{" "}
                                {t("dicom.columns.instance.sopInstanceUid")}
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

                        <DownloadSubMenu
                            onDicomDownload={handleDicomDownload}
                            onJpgDownload={handleJpgDownload}
                            onPngDownload={handlePngDownload}
                        />

                        {canUpdate && (
                            <>
                                <ContextMenuSeparator />

                                <ShareTagContextMenuSub
                                    token={token}
                                    targetType="instance"
                                    targetId={sopInstanceUid}
                                    password={password}
                                    onOpenCreateTagDialog={() =>
                                        openCreateTagDialog({
                                            token,
                                            targetType: "instance",
                                            targetId: sopInstanceUid,
                                            password,
                                        })
                                    }
                                />
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

                        <DownloadSubMenu
                            onDicomDownload={handleDicomDownload}
                            onJpgDownload={handleJpgDownload}
                            onPngDownload={handlePngDownload}
                        />
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
