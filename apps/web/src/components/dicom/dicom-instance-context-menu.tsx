"use client";

import { useMutation } from "@tanstack/react-query";
import { DownloadIcon, Trash2Icon } from "lucide-react";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
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
import { getQueryClient } from "@/react-query/get-query-client";
import { recycleDicomInstanceMutation } from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";
import { CreateTagDialog } from "./tag/create-tag-dialog";
import { TagContextMenuSub } from "./tag/tag-context-menu-sub";

interface DicomInstanceContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
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
            <ContextMenuItem
                onClick={onDicomDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>DICOM</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onJpgDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>JPG</span>
            </ContextMenuItem>
            <ContextMenuItem
                onClick={onPngDownload}
                className="flex items-center space-x-2"
            >
                <DownloadIcon className="size-4 mr-2" />
                <span>PNG</span>
            </ContextMenuItem>
        </>
    );
};

export function DicomInstanceContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
}: DicomInstanceContextMenuProps) {
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] = useState(false);
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const queryClient = getQueryClient();
    const { getSelectedInstanceIds, clearSelection } =
        useDicomInstanceSelectionStore();

    const selectedIds = getSelectedInstanceIds();

    const { handleDownload: handleDicomDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstance(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstances(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download instance",
    });

    const { handleDownload: handleJpgDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download instance as jpg",
    });

    const { handleDownload: handlePngDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download instance as png",
    });

    const { mutate: recycleDicomInstance } = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM instance...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM instance recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM instance");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const handleRecycle = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowRecycleConfirmDialog(true);
    };

    const handleConfirmRecycle = () => {
        recycleDicomInstance();
    }

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-56">
                    {selectedIds.length === 1 && (
                        <>
                            <ContextMenuSub>
                                <ContextMenuSubTrigger>
                                    <DownloadIcon className="size-4 mr-4" />
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

                            <ContextMenuSeparator />

                            <TagContextMenuSub 
                                workspaceId={workspaceId}
                                targetType="instance"
                                targetId={sopInstanceUid}
                                onOpenCreateTagDialog={() => setOpenCreateTagDialog(true)}
                            />

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

                            <ContextMenuSeparator />

                            <ContextMenuItem
                                onClick={handleRecycle}
                                className="flex items-center"
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
                dicomLevel={"instance"}
                selectedCount={selectedIds.length}
                onConfirm={handleConfirmRecycle}
            />

            <CreateTagDialog 
                open={openCreateTagDialog}
                onOpenChange={setOpenCreateTagDialog}
                workspaceId={workspaceId}
                targetType="instance"
                targetId={sopInstanceUid}
            />
        </>
    );
}
