"use client";

import { CornerDownLeftIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadShareMultipleStudies } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { ShareCreateTagDialog } from "./tag/share-create-tag-dialog";
import { ShareTagContextMenuSub } from "./tag/share-tag-context-menu-sub";
import { useParams } from "next/navigation";
import { useT } from "@/app/_i18n/client";

interface SharedDicomStudyContextMenuProps {
    children: React.ReactNode;
    token: string;
    password?: string;
    studyInstanceUid: string;
    publicPermissions: number;
}

export function SharedDicomStudyContextMenu({
    children,
    token,
    password,
    studyInstanceUid,
    publicPermissions,
}: SharedDicomStudyContextMenuProps) {
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const router = useRouter();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const { getSelectedStudyIds } = useDicomStudySelectionStore();
    const selectedIds = getSelectedStudyIds();

    const canUpdate = hasPermission(
        publicPermissions,
        SHARE_PERMISSIONS.UPDATE,
    );

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const params = password
            ? `?password=${encodeURIComponent(password)}`
            : "";
        router.push(`/${lng}/share/${token}/studies/${studyInstanceUid}${params}`);
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedStudyIds();

        if (currentSelectedIds.length === 0) {
            toast.error(t("dicom.messages.selectToDownload", { level: "study" }));
            return;
        }

        try {
            await downloadShareMultipleStudies(
                token,
                currentSelectedIds,
                password,
            );
        } catch (error) {
            console.error(t("dicom.messages.downloadSelectedError", { level: "studies" }), error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(t("dicom.messages.downloadSelectedError", { level: "studies" }));
        }
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        openBlueLightViewer({
            shareToken: token,
            studyInstanceUid,
            password,
        });
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-60">
                    {selectedIds.length === 1 && (
                        <>
                            <ContextMenuItem
                                onClick={handleEnterSeries}
                                className="flex items-center space-x-2"
                            >
                                <CornerDownLeftIcon className="size-4" />
                                <span>{t("dicom.contextMenu.enterSeries")}</span>
                            </ContextMenuItem>
                            <ContextMenuItem
                                onClick={handleOpenBlueLightViewer}
                                className="flex items-center space-x-2"
                            >
                                <EyeIcon className="size-4" />
                                <span>{t("dicom.contextMenu.openInBlueLight")}</span>
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
                                        targetType="study"
                                        targetId={studyInstanceUid as string}
                                        password={password}
                                        onOpenCreateTagDialog={() =>
                                            setOpenCreateTagDialog(true)
                                        }
                                    />
                                </>
                            )}
                        </>
                    )}

                    {selectedIds.length > 1 && (
                        <>
                            <ContextMenuLabel>
                                {t("dicom.contextMenu.selectedItems", { count: selectedIds.length })}
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
            
            {canUpdate && (
                <ShareCreateTagDialog
                open={openCreateTagDialog}
                onOpenChange={setOpenCreateTagDialog}
                token={token}
                targetType="study"
                    targetId={studyInstanceUid as string}
                    password={password}
                />
            )}
        </>
    );
}
