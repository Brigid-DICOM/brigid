"use client";

import {
    CornerDownLeftIcon,
    DownloadIcon,
    EyeIcon,
    TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
    return (
        <>
            <ContextMenuItem
                onClick={onDicomDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4" />
                <span>DICOM</span>
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
    )
}

export function SharedDicomInstanceContextMenu({
    children,
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
    publicPermissions,
}: SharedDicomInstanceContextMenuProps) {
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const router = useRouter();
    const { open } = useBlueLightViewerStore();

    const { getSelectedInstanceIds, clearSelection } = useDicomInstanceSelectionStore();
    const selectedIds = getSelectedInstanceIds();

    const canUpdate = hasPermission(publicPermissions, SHARE_PERMISSIONS.UPDATE);

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
            )
        } catch (error) {
            console.error("Failed to download selected instances", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected instances");
        }
    }

    const handleJpgDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        try {
            await downloadShareMultipleInstancesAsJpg(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
            )
        } catch (error) {
            console.error("Failed to download selected instances as JPG", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected instances as JPG");
        }
    }

    const handlePngDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        try {
            await downloadShareMultipleInstancesAsPng(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
            )
        } catch (error) {
            console.error("Failed to download selected instances as PNG", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected instances as PNG");
        }
    }

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
    }

    useEffect(() => {
        return () => {
            clearSelection();
        }
    }, [clearSelection]);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-56">
                {selectedIds.length === 1 && (
                    <>
                        <ContextMenuItem
                            onClick={handleOpenBlueLightViewer}
                            className="flex items-center space-x-2"
                        >
                            <EyeIcon className="size-4" />
                            <span>Open in BlueLight Viewer</span>
                        </ContextMenuItem>

                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                <DownloadIcon className="size-4 mr-4" />
                                <span>Download</span>
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <DownloadSubMenuItems
                                    onDicomDownload={handleDicomDownload}
                                    onJpgDownload={handleJpgDownload}
                                    onPngDownload={handlePngDownload}
                                />
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        {canUpdate && (
                            <>
                                <ContextMenuSeparator />

                                {/* TODO: 實作 Share 模式的 tag management dialog */}
                            </>
                        )}
                    </>
                )}

                {selectedIds.length > 1 && (
                    <>
                        <ContextMenuSub>
                            <ContextMenuSubTrigger>
                                <DownloadIcon className="size-4 mr-4" />
                                <span>Download</span>
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent>
                                <DownloadSubMenuItems
                                    onDicomDownload={handleDicomDownload}
                                    onJpgDownload={handleJpgDownload}
                                    onPngDownload={handlePngDownload}
                                />
                            </ContextMenuSubContent>
                        </ContextMenuSub>

                        {canUpdate && (
                            <>
                                <ContextMenuSeparator />

                                {/* TODO: 實作 Share 模式的 tag management dialog */}
                            </>
                        )}
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}