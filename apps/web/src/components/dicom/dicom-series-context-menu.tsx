"use client";

import { useMutation } from "@tanstack/react-query";
import { CornerDownLeftIcon, DownloadIcon, Trash2Icon } from "lucide-react";
import { nanoid } from "nanoid";
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
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomSeriesMutation } from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";

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
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] = useState(false);
    const queryClient = getQueryClient();
    const router = useRouter();
    const { getSelectedSeriesIds, clearSelection } = useDicomSeriesSelectionStore();

    const selectedIds = getSelectedSeriesIds();

    const { mutate: recycleDicomSeries } = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid()
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        }
    })

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
        closeContextMenu();

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

    const handleRecycle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowRecycleConfirmDialog(true);
    }

    const handleConfirmRecycle = () => {
        recycleDicomSeries();
    }

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
                                onClick={handleDownloadThis}
                                className="flex items-center space-x-2"
                            >
                                <DownloadIcon className="size-4" />
                                <span>Download</span>
                            </ContextMenuItem>

                            <ContextMenuSeparator />
                            
                            <ContextMenuItem
                                onClick={handleRecycle}
                                className="flex items-center space-x-2"
                            >
                                <Trash2Icon className="size-4" />
                                <span>Recycle</span>
                            </ContextMenuItem>
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

                            <ContextMenuSeparator />

                            <ContextMenuItem
                                onClick={handleRecycle}
                                className="flex items-center space-x-2"
                            >
                                <Trash2Icon className="size-4" />
                                <span>Recycle</span>
                            </ContextMenuItem>
                        </>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            <DicomRecycleConfirmDialog 
                open={showRecycleConfirmDialog}
                onOpenChange={setShowRecycleConfirmDialog}
                dicomLevel={"series"}
                selectedCount={selectedIds.length}
                onConfirm={handleConfirmRecycle}
            />
        </>
    );
}
