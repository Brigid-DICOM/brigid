"use client";

import type { DicomSeriesData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getShareSeriesThumbnailQuery } from "@/react-query/queries/publicShare";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { Skeleton } from "../ui/skeleton";
import { SharedDicomSeriesContextMenu } from "./shared-dicom-series-context-menu";

interface SharedDicomSeriesCardProps {
    series: DicomSeriesData;
    token: string;
    password?: string;
    studyInstanceUid?: string;
    className?: string;
    publicPermissions?: number;
}

export function SharedDicomSeriesCard({
    series,
    token,
    password,
    studyInstanceUid,
    publicPermissions = 0,
    className,
}: SharedDicomSeriesCardProps) {
    const router = useRouter();
    
    const seriesInstanceUid = series["0020000E"]?.Value?.[0] || "N/A";
    const modality = series["00080060"]?.Value?.[0] || "N/A";
    const seriesDescription = series["0008103E"]?.Value?.[0] || "N/A";
    const seriesDate = series["00080021"]?.Value?.[0] || "N/A";
    const seriesNumber = series["00200011"]?.Value?.[0] || "N/A";
    const numberOfInstances = series["00201209"]?.Value?.[0] || 0;
    
    const studyUidFromSeries = series["0020000D"]?.Value?.[0] as string | undefined;
    const effectiveStudyUid = studyInstanceUid || studyUidFromSeries;

    const {
        toggleSeriesSelection,
        isSeriesSelected,
        selectSeries,
        clearSelection,
    } = useDicomSeriesSelectionStore();

    const isSelected = isSeriesSelected(seriesInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getShareSeriesThumbnailQuery({
            token,
            password,
            studyInstanceUid: effectiveStudyUid || "N/A",
            seriesInstanceUid,
            viewport: "224,224",
        })
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const handleDoubleClick = () => {
        if (effectiveStudyUid) {
            const params = password ? `?password=${encodeURIComponent(password)}` : "";
            router.push(`/share/${token}/studies/${effectiveStudyUid}/series/${seriesInstanceUid}${params}`);
        }
    }

    const { handleCardClick, handleContextMenu, handleDoubleClick: onDoubleClick } = useDicomCardSelection({
        itemId: seriesInstanceUid,
        isSelected,
        toggleSelection: toggleSeriesSelection,
        selectItem: selectSeries,
        clearSelection,
        onDoubleClick: handleDoubleClick,
    });

    return (
        <SharedDicomSeriesContextMenu
          token={token}
          password={password}
          studyInstanceUid={effectiveStudyUid || "N/A"}
          seriesInstanceUid={seriesInstanceUid}
          publicPermissions={publicPermissions}
        >
                <Card
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
                onDoubleClick={onDoubleClick}
            >
                {/* Thumbnail */}
                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                    {isLoadingThumbnail ? (
                        <Skeleton className="w-full h-full" />
                    ) : thumbnailUrl ? (
                        <Image 
                            src={thumbnailUrl}
                            alt="DICOM Series Thumbnail"
                            width={224}
                            height={224}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ): (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImageIcon className="h-12 w-12 opacity-50" />
                            <div className="text-xs">
                                {numberOfInstances} images
                            </div>
                        </div>
                    )}
                </div>

                <CardContent className="pt-4">
                    <div className="space-y-2">
                        {/* Modality Badge */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {modality}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Series #{seriesNumber}
                            </span>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                Description:
                            </span>
                            <div className="text-foreground truncate">
                                {seriesDescription}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                Series Date:
                            </span>
                            <div className="text-foreground truncate">
                                {seriesDate}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                Series UID:
                            </span>
                            <div className="text-foreground truncate text-xs font-mono">
                                {seriesInstanceUid}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </SharedDicomSeriesContextMenu>
        
    );
}