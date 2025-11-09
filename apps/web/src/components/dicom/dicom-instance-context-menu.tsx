"use client";

import {
    DownloadIcon
} from "lucide-react";
import type React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
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
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";

interface DicomInstanceContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
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
            <ContextMenuItem onClick={onDicomDownload} className="flex items-center space-x-2">
                <DownloadIcon className="size-4 mr-2" />
                <span>DICOM</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={onJpgDownload} className="flex items-center space-x-2">
                <DownloadIcon className="size-4 mr-2" />
                <span>JPG</span>
            </ContextMenuItem>
            <ContextMenuItem onClick={onPngDownload} className="flex items-center space-x-2">
                <DownloadIcon className="size-4 mr-2" />
                <span>PNG</span>
            </ContextMenuItem>
        </>
    )
}

export function DicomInstanceContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
}: DicomInstanceContextMenuProps) {
    const { getSelectedInstanceIds } = useDicomInstanceSelectionStore();

    const selectedIds = getSelectedInstanceIds();

    const {
        handleDownload: handleDicomDownload
    } = useDownloadHandler({
        downloadSingle: (id: string) => downloadInstance(workspaceId, studyInstanceUid, seriesInstanceUid, id),
        downloadMultiple: (ids: string[]) => downloadMultipleInstances(workspaceId, studyInstanceUid, seriesInstanceUid, ids),
        errorMessage: "Failed to download instance",
    });

    const {
        handleDownload: handleJpgDownload
    } = useDownloadHandler({
        downloadSingle: (id: string) => downloadInstanceAsJpg(workspaceId, studyInstanceUid, seriesInstanceUid, id),
    downloadMultiple: (ids: string[]) => downloadMultipleInstancesAsJpg(workspaceId, studyInstanceUid, seriesInstanceUid, ids),
        errorMessage: "Failed to download instance as jpg",
    });

    const {
        handleDownload: handlePngDownload
    } = useDownloadHandler({
        downloadSingle: (id: string) => downloadInstanceAsPng(workspaceId, studyInstanceUid, seriesInstanceUid, id),
        downloadMultiple: (ids: string[]) => downloadMultipleInstancesAsPng(workspaceId, studyInstanceUid, seriesInstanceUid, ids),
        errorMessage: "Failed to download instance as png",
    });

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                {selectedIds.length === 1 && (
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <DownloadIcon className="size-4 mr-2" />
                            <span>Download</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <DownloadSubMenuItems
                                onDicomDownload={() => {
                                    closeContextMenu();
                                    handleDicomDownload(selectedIds);
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

                {selectedIds.length > 1 && (
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <DownloadIcon className="size-4 mr-2" />
                            <span>Download Selected Items ({selectedIds.length})</span>
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <DownloadSubMenuItems
                                onDicomDownload={() => {
                                    closeContextMenu();
                                    handleDicomDownload(selectedIds);
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
            </ContextMenuContent>
        </ContextMenu>
    )
}