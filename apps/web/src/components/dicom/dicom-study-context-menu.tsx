"use client";

import {
    CornerDownLeftIcon, 
    DownloadIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import {
    downloadMultipleStudies,
    downloadStudy
} from "@/lib/clientDownload";
import { closeContextMenu } from "@/lib/utils";
import {
    useDicomStudySelectionStore
} from "@/stores/dicom-study-selection-store";

interface DicomStudyContextMenuProps {
    children: React.ReactNode;
    workspaceId: string;
    studyInstanceUid: string;
}

export function DicomStudyContextMenu({
    children,
    workspaceId,
    studyInstanceUid,
}: DicomStudyContextMenuProps) {
    const router = useRouter();
    const {
        getSelectedStudyIds
    } = useDicomStudySelectionStore();

    const selectedIds = getSelectedStudyIds();

    const handleViewSeries = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        router.push(`/dicom-instances/${studyInstanceUid}`);
    }

    const handleDownloadThis = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        
        try {
            await downloadStudy(workspaceId, studyInstanceUid);
        } catch(error) {
            console.error("Failed to download this study", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download this study");
        }
    };

    const handleDownloadSelected = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();

        const currentSelectedIds = getSelectedStudyIds();

        if (currentSelectedIds.length === 0) {
            toast.error("Please select at least one study to download");
            return;
        }

        try {
            if (currentSelectedIds.length === 1) {
                await downloadStudy(workspaceId, currentSelectedIds[0]);
            } else {
                await downloadMultipleStudies(workspaceId, currentSelectedIds);
            }
        } catch(error) {
            console.error("Failed to download selected studies", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected studies");
        }
    };

    

    return (
        <ContextMenu>
            <ContextMenuTrigger 
                asChild
            >
                {children}
            </ContextMenuTrigger>

            <ContextMenuContent className="w-56">
                {selectedIds.length === 1 && <ContextMenuItem
                    onClick={handleViewSeries}
                    className="flex items-center space-x-2"
                >
                    <CornerDownLeftIcon className="size-4" />
                    <span>View Series</span>
                </ContextMenuItem>
                }
                
                {selectedIds.length === 1 && <ContextMenuItem 
                    onClick={handleDownloadThis}
                    className="flex items-center space-x-2"
                >
                    <DownloadIcon className="size-4" />
                    <span>Download</span>
                </ContextMenuItem>
                }

                {selectedIds.length > 1 && <ContextMenuItem 
                    onClick={handleDownloadSelected}
                    className="flex items-center space-x-2"
                >
                    <DownloadIcon className="size-4" />
                    <span>Download Selected Items ({selectedIds.length})</span>
                </ContextMenuItem>
                }
            </ContextMenuContent>
        </ContextMenu>
    )
}