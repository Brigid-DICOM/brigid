"use client";

// TODO: 實作 share 模式的 tag management dialog

import { CornerDownLeftIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
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
    publicPermissions
}: SharedDicomStudyContextMenuProps) {
    const router = useRouter();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();
    const { getSelectedStudyIds } = useDicomStudySelectionStore();
    const selectedIds = getSelectedStudyIds();

    const canUpdate = hasPermission(publicPermissions, SHARE_PERMISSIONS.UPDATE);

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const params = password ? `?password=${encodeURIComponent(password)}` : "";
        router.push(`/share/${token}/studies/${studyInstanceUid}${params}`);
    }

    const handleDownloadSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedStudyIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one study to download");
            return;
        }

        try {
            await downloadShareMultipleStudies(
                token,
                currentSelectedIds,
                password,
            );
        } catch (error) {
            console.error("Failed to download selected studies", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected studies");
        }
    }

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        openBlueLightViewer({
            shareToken: token,
            studyInstanceUid,
            password,
        });
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                {selectedIds.length === 1 && (
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
                            onClick={handleDownloadSelected}
                            className="flex items-center space-x-2"
                        >
                            <DownloadIcon className="size-4" />
                            <span>Download</span>
                        </ContextMenuItem>

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
                        <ContextMenuLabel>
                            Selected Item ({selectedIds.length})
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
    )
}