"use client";

import type { DicomSeriesData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getDicomSeriesThumbnailQuery } from "@/react-query/queries/dicomSeries";
import { getTargetTagsQuery } from "@/react-query/queries/tag";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DicomCardHeaderTagsDisplay } from "./dicom-card-header-tags-display";
import { DicomSeriesContextMenu } from "./dicom-series-context-menu";
import { DicomRecycleSeriesContextMenu } from "./recycle/dicom-recycle-series-context-menu";

interface DicomSeriesCardProps {
    series: DicomSeriesData;
    workspaceId: string;
    studyInstanceUid: string;
    className?: string;
    type: "management" | "recycle";
}

export function DicomSeriesCard({
    series,
    workspaceId,
    studyInstanceUid,
    className,
    type = "management",
}: DicomSeriesCardProps) {
    const router = useRouter();
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const modality = series["00080060"]?.Value?.[0] || "N/A";
    const seriesDescription = series["0008103E"]?.Value?.[0] || "N/A";
    const seriesDate = series["00080021"]?.Value?.[0] || "N/A";
    const numberOfSeriesRelatedInstances = series["00201209"]?.Value?.[0] || 0;

    const {
        toggleSeriesSelection,
        isSeriesSelected,
        selectSeries,
        clearSelection,
    } = useDicomSeriesSelectionStore();

    const isSelected = isSeriesSelected(seriesInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getDicomSeriesThumbnailQuery(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            "224,224",
        ),
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        getTargetTagsQuery(workspaceId, "series", seriesInstanceUid),
    );

    const { handleCardClick, handleContextMenu, handleDoubleClick } = useDicomCardSelection({
        itemId: seriesInstanceUid,
        isSelected,
        toggleSelection: toggleSeriesSelection,
        selectItem: selectSeries,
        clearSelection,
        onDoubleClick: () => router.push(`/${workspaceId}/dicom-studies/${studyInstanceUid}/series/${seriesInstanceUid}`),
    });

    const ContextMenu = type === "management" ? (
        DicomSeriesContextMenu
    ) : (
        DicomRecycleSeriesContextMenu
    );

    return (
        <ContextMenu
            workspaceId={workspaceId}
            studyInstanceUid={studyInstanceUid}
            seriesInstanceUid={seriesInstanceUid}
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
                onDoubleClick={handleDoubleClick}
            >
                <DicomCardHeaderTagsDisplay 
                    tags={tags?.data ?? []}
                    isLoadingTags={isLoadingTags}
                    isSelected={isSelected}
                    maxTagDisplay={2}
                />

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
                                Modality:
                            </span>
                            <div className="text-gray-900 truncate">{modality}</div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Series Description:
                            </span>
                            <div className="text-gray-900 truncate">
                                {seriesDescription}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Series Date:
                            </span>
                            <div className="text-gray-900 truncate">
                                {seriesDate}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-gray-600">
                                Number of Series Related Instances:
                            </span>
                            <div className="text-gray-900 truncate">
                                {numberOfSeriesRelatedInstances}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ContextMenu>
    );
}
