"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getDicomInstanceThumbnailQuery } from "@/react-query/queries/dicomInstance";
import { getTargetTagsQuery } from "@/react-query/queries/tag";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DicomCardTagBadge } from "./dicom-card-tag-badge";
import { DicomInstanceContextMenu } from "./dicom-instance-context-menu";
import { DicomRecycleInstanceContextMenu } from "./recycle/dicom-recycle-instance-context-menu";

interface DicomInstanceCardProps {
    instance: DicomInstanceData;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    className?: string;
    type: "management" | "recycle";
}

export function DicomInstanceCard({
    instance,
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
    className,
    type = "management",
}: DicomInstanceCardProps) {
    const sopClassUid = instance["00080016"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";
    const acquisitionDate = instance["00080022"]?.Value?.[0] || "N/A";
    const contentDate = instance["00080023"]?.Value?.[0] || "N/A";
    const instanceNumber = instance["00200013"]?.Value?.[0] || 0;

    const {
        toggleInstanceSelection,
        isInstanceSelected,
        selectInstance,
        clearSelection,
    } = useDicomInstanceSelectionStore();

    const isSelected = isInstanceSelected(sopInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getDicomInstanceThumbnailQuery(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            "224,224",
        ),
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        getTargetTagsQuery(workspaceId, "instance", sopInstanceUid),
    );

    const { handleCardClick, handleContextMenu } = useDicomCardSelection({
        itemId: sopInstanceUid,
        isSelected,
        toggleSelection: toggleInstanceSelection,
        selectItem: selectInstance,
        clearSelection,
    });

    const ContextMenu = type === "management" ? (
        DicomInstanceContextMenu
    ) : (
        DicomRecycleInstanceContextMenu
    );

    return (
        <ContextMenu
            workspaceId={workspaceId}
            studyInstanceUid={studyInstanceUid}
            seriesInstanceUid={seriesInstanceUid}
            sopInstanceUid={sopInstanceUid}
        >
            <Card
                data-dicom-card
                className={cn(
                    "w-full max-w-sm",
                    "overflow-hidden",
                    "transition-all duration-200",
                    "pt-0 gap-0",
                    "select-none",
                    "relative",
                    isSelected
                        ? ["ring-2 ring-primary", "shadow-lg", "bg-accent"]
                        : [
                              "hover:shadow-lg",
                              "hover:ring-2 hover:ring-accent hover:bg-accent/10",
                          ],
                    className,
                )}
                onClick={handleCardClick}
                onContextMenu={handleContextMenu}
            >
                <div className="flex items-stretch justify-between px-2 py-1.5 bg-white/50 backdrop-blur-sm border-b border-gray-100 leading-none">
                    <div className="flex-1 flex min-w-0 items-center">
                        {tags?.data && tags?.data.length > 0 ? (
                            <DicomCardTagBadge tags={tags.data} maxDisplay={2} />
                        ): (
                            <div className="h-5" />
                        )}

                        {isLoadingTags && (
                            <Skeleton className="h-5 w-7 rounded-full" />
                        )}
                    </div>

                    
                    {isSelected && (
                        <div className="ml-2 flex-shrink-0">
                            <div className="bg-primary text-white rounded-full p-1.5 shadow-md">
                                <CheckIcon className="size-2" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center mb-4">
                    {isLoadingThumbnail ? (
                        <Skeleton className="w-full h-full" />
                    ) : thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt="DICOM Study Thumbnail"
                            width={224}
                            height={224}
                            className={cn(
                                "w-full h-full object-cover transition-opacity duration-200",
                                isSelected ? "opacity-90" : "opacity-100",
                            )}
                            unoptimized
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            No thumbnail available
                        </div>
                    )}
                </div>

                <CardContent>
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Instance Number:
                            </span>
                            <div className="text-gray-900 truncate">
                                {instanceNumber}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                SOP Class UID:
                            </span>
                            <div className="text-gray-900 truncate">
                                {sopClassUid}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                SOP Instance UID:
                            </span>
                            <div className="text-gray-900 truncate">
                                {sopInstanceUid}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Acquisition Date:
                            </span>
                            <div className="text-gray-900 truncate">
                                {acquisitionDate}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Content Date:
                            </span>
                            <div className="text-gray-900 truncate">
                                {contentDate}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ContextMenu>
    );
}
