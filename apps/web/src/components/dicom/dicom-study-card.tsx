"use client";

import type { DicomStudyData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getDicomStudyThumbnailQuery } from "@/react-query/queries/dicomThumbnail";
import { getTargetTagsQuery } from "@/react-query/queries/tag";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DicomCardTagBadge } from "./dicom-card-tag-badge";
import { DicomStudyContextMenu } from "./dicom-study-context-menu";
import { DicomRecycleStudyContextMenu } from "./recycle/dicom-recycle-study-context-menu";

interface DicomStudyCardProps {
    study: DicomStudyData;
    workspaceId: string;
    className?: string;
    type: "management" | "recycle";
}

export function DicomStudyCard({
    study,
    workspaceId,
    className,
    type = "management",
}: DicomStudyCardProps) {
    const router = useRouter();
    const patientId = study["00100020"]?.Value?.[0] || "N/A";
    const patientName = study["00100010"]?.Value?.[0]?.Alphabetic || "N/A";
    const accessionNumber = study["00080050"]?.Value?.[0] || "N/A";
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";

    const { toggleStudySelection, isStudySelected, selectStudy, clearSelection } = useDicomStudySelectionStore();

    const isSelected = isStudySelected(studyInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getDicomStudyThumbnailQuery(workspaceId, studyInstanceUid, "224,224"),
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        getTargetTagsQuery(workspaceId, "study", studyInstanceUid),
    );

    const { handleCardClick, handleContextMenu, handleDoubleClick } = useDicomCardSelection({
        itemId: studyInstanceUid,
        isSelected,
        toggleSelection: toggleStudySelection,
        selectItem: selectStudy,
        clearSelection,
        onDoubleClick: () => router.push(`/dicom-studies/${studyInstanceUid}`),
    });

    const ContextMenu = type === "management" ? (
        DicomStudyContextMenu
    ) : (
        DicomRecycleStudyContextMenu
    );

    return (
        <ContextMenu
            workspaceId={workspaceId}
            studyInstanceUid={studyInstanceUid}
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
                    isSelected ? [
                        "ring-2 ring-primary",
                        "shadow-lg",
                        "bg-accent"
                    ] : [
                        "hover:shadow-lg",
                        "hover:ring-2 hover:ring-accent hover:bg-accent/10",
                    ],
                    className,
                )}
                onClick={handleCardClick}
                onContextMenu={handleContextMenu}
                onDoubleClick={handleDoubleClick}
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
                                isSelected ? "opacity-90" : "opacity-100"
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
                                Patient ID:
                            </span>
                            <div className="text-gray-900 truncate">
                                {patientId}
                            </div>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Patient Name:
                            </span>
                            <div className="text-gray-900 truncate">
                                {patientName}
                            </div>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Accession Number:
                            </span>
                            <div className="text-gray-900 truncate">
                                {accessionNumber}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ContextMenu>
    );
}
