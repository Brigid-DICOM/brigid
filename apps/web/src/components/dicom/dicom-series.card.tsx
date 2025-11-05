"use client";

import { useQuery } from "@tanstack/react-query";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getDicomSeriesThumbnailQuery } from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DicomSeriesContextMenu } from "./dicom-series-context-menu";

interface DicomSeriesData {
    "0020000E"?: { Value: [string] }; // Series Instance UID
    "00080060"?: { Value: [string] }; // Modality
    "0008103E"?: { Value: [string] }; // Series Description
    "00080021"?: { Value: [string] }; // Series Date
    "00201209"?: { Value: [number] }; // Number of Series Related Instances
}

interface DicomSeriesCardProps {
    series: DicomSeriesData;
    workspaceId: string;
    studyInstanceUid: string;
    className?: string;
}

export function DicomSeriesCard({
    series,
    workspaceId,
    studyInstanceUid,
    className,
}: DicomSeriesCardProps) {
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

    const { handleCardClick, handleContextMenu } = useDicomCardSelection({
        itemId: seriesInstanceUid,
        isSelected,
        toggleSelection: toggleSeriesSelection,
        selectItem: selectSeries,
        clearSelection,
    });

    return (
        <DicomSeriesContextMenu
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
                    "pt-0",
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
                {isSelected && (
                    <div className="absolute top-2 right-2 z-10 bg-primary/70 text-white rounded-full p-1">
                        <CheckIcon className="size-3" />
                    </div>
                )}

                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
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
        </DicomSeriesContextMenu>
    );
}
