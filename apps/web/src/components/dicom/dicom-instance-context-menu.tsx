"use client";

import {
    DownloadIcon
} from "lucide-react";
import type React from "react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import {
    downloadInstance,
    downloadMultipleInstances
} from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";

interface DicomInstanceContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
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
        handleDownload
    } = useDownloadHandler({
        downloadSingle: (id: string) => downloadInstance(workspaceId, studyInstanceUid, seriesInstanceUid, id),
        downloadMultiple: (ids: string[]) => downloadMultipleInstances(workspaceId, studyInstanceUid, seriesInstanceUid, ids),
        errorMessage: "Failed to download instance",
    });

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                {selectedIds.length === 1 && (
                    <ContextMenuItem
                        onClick={() => {
                            closeContextMenu();
                            handleDownload(selectedIds);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <DownloadIcon className="size-4" />
                        <span>Download</span>
                    </ContextMenuItem>
                )}

                {selectedIds.length > 1 && (
                    <ContextMenuItem
                        onClick={() => {
                            closeContextMenu();
                            handleDownload(selectedIds);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <DownloadIcon className="size-4" />
                        <span>Download Selected Items ({selectedIds.length})</span>
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    )
}