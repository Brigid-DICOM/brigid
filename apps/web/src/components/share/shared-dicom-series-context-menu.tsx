"use client";

import {
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { downloadShareMultipleSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { ShareCreateTagDialog } from "./tag/share-create-tag-dialog";
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
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const router = useRouter();
    const { open } = useBlueLightViewerStore();

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
            `/share/${token}/studies/${studyInstanceUid}/series/${seriesInstanceUid}${params}`,
        );
    };

    const handleDownloadSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedSeriesIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one series to download");
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
            console.error("Failed to download selected series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected series");
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

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
                <ContextMenuContent className="w-56">
                    {selectedIds.length === 1 && (
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
                                onClick={handleDownloadSelected}
                                className="flex items-center space-x-2"
                            >
                                <DownloadIcon className="size-4" />
                                <span>Download</span>
                            </ContextMenuItem>

                            {canUpdate && (
                                <>
                                    <ContextMenuSeparator />

                                    <ShareTagContextMenuSub
                                        token={token}
                                        targetType="series"
                                        targetId={seriesInstanceUid}
                                        password={password}
                                        onOpenCreateTagDialog={() => setOpenCreateTagDialog(true)}
                                    />
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
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canUpdate && (
                <ShareCreateTagDialog 
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    token={token}
                    targetType="series"
                    targetId={seriesInstanceUid}
                    password={password}
                />
            )}
        </>
    );
}
