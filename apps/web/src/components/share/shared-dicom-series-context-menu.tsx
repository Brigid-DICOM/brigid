"use client";

import {
    CopyIcon,
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadShareMultipleSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useShareCreateTagDialogStore } from "@/stores/share-create-tag-dialog-store";
import { ShareTagContextMenuSub } from "./tag/share-tag-context-menu-sub";

interface SharedDicomSeriesContextMenuProps {
    children: React.ReactNode;
    token: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    publicPermissions: number;
}

export function SharedDicomSeriesContextMenu({
    children,
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    publicPermissions,
}: SharedDicomSeriesContextMenuProps) {
    const { openDialog: openCreateTagDialog } = useShareCreateTagDialogStore();
    const router = useRouter();
    const { open } = useBlueLightViewerStore();
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const { getSelectedSeriesIds } = useDicomSeriesSelectionStore();
    const selectedIds = getSelectedSeriesIds();

    const canUpdate = hasPermission(
        publicPermissions,
        SHARE_PERMISSIONS.UPDATE,
    );

    const handleEnterInstances = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const params = password
            ? `?password=${encodeURIComponent(password)}`
            : "";
        router.push(
            `/${lng}/share/${token}/studies/${studyInstanceUid}/series/${seriesInstanceUid}${params}`,
        );
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
            await downloadShareMultipleSeries(
                token,
                studyInstanceUid,
                currentSelectedIds,
                password,
            );
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

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        open({
            shareToken: token,
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
                        <ContextMenuItem
                            onClick={handleCopySeriesInstanceUid}
                            className="flex items-center space-x-2"
                        >
                            <CopyIcon className="size-4" />
                            <span>
                                {t("dicom.contextMenu.copy")}{" "}
                                {t("dicom.columns.series.seriesInstanceUid")}
                            </span>
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={handleEnterInstances}
                            className="flex items-center space-x-2"
                        >
                            <CornerDownLeftIcon className="size-4" />
                            <span>{t("dicom.contextMenu.enterInstances")}</span>
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
                            onClick={handleDownloadSelected}
                            className="flex items-center space-x-2"
                        >
                            <DownloadIcon className="size-4" />
                            <span>{t("dicom.contextMenu.download")}</span>
                        </ContextMenuItem>

                        {canUpdate && (
                            <>
                                <ContextMenuSeparator />

                                <ShareTagContextMenuSub
                                    token={token}
                                    targetType="series"
                                    targetId={seriesInstanceUid}
                                    password={password}
                                    onOpenCreateTagDialog={() =>
                                        openCreateTagDialog({
                                            token,
                                            targetType: "series",
                                            targetId: seriesInstanceUid,
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

                        <ContextMenuItem
                            onClick={handleDownloadSelected}
                            className="flex items-center space-x-2"
                        >
                            <DownloadIcon className="size-4" />
                            <span>{t("dicom.contextMenu.download")}</span>
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
