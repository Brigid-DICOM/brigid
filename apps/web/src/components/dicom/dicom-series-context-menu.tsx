"use client";

import { CornerDownLeftIcon, DownloadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";

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
    const router = useRouter();
    const { getSelectedSeriesIds } = useDicomSeriesSelectionStore();

    const selectedIds = getSelectedSeriesIds();

    const handleEnterInstances = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        router.push(`/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`);
    }

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
            console.error("Failed to download this series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download this series");
        }
    };

    const handleDownloadSelected = async (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        e.preventDefault();

        const currentSelectedIds = getSelectedSeriesIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one series to download");
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
            console.error("Failed to download selected series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected series");
        }
    };

    return (
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
                            onClick={handleDownloadThis}
                            className="flex items-center space-x-2"
                        >
                            <DownloadIcon className="size-4" />
                            <span>Download</span>
                        </ContextMenuItem>
                    </>
                )}

                {selectedIds.length > 1 && (
                    <ContextMenuItem
                        onClick={handleDownloadSelected}
                        className="flex items-center space-x-2"
                    >
                        <DownloadIcon className="size-4" />
                        <span>
                            Download Selected Items ({selectedIds.length})
                        </span>
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
