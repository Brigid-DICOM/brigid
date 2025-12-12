"use client";

import type { DicomStudyData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { FolderIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "nextjs-toploader/app";
import { Card, CardContent } from "@/components/ui/card";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getShareStudyThumbnailQuery } from "@/react-query/queries/publicShare";
import { getTargetShareTagsQuery } from "@/react-query/queries/share-tag";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { DicomCardHeaderTagsDisplay } from "../dicom/dicom-card-header-tags-display";
import { Skeleton } from "../ui/skeleton";
import { SharedDicomStudyContextMenu } from "./shared-dicom-study-context-menu";
import { useParams } from "next/navigation";
import { useT } from "@/app/_i18n/client";

interface SharedDicomStudyCardProps {
    study: DicomStudyData;
    token: string;
    password?: string;
    className?: string;
    publicPermissions?: number;
}

export function SharedDicomStudyCard({
    study,
    token,
    password,
    publicPermissions = 0,
    className,
}: SharedDicomStudyCardProps) {
    const router = useRouter();
    const { t } = useT("translation");
    const { lng } = useParams<{ lng: string }>();
    const patientId = study["00100020"]?.Value?.[0] || "N/A";
    const patientName = study["00100010"]?.Value?.[0]?.Alphabetic || "N/A";
    const accessionNumber = study["00080050"]?.Value?.[0] || "N/A";
    const studyDate = study["00080020"]?.Value?.[0] || "N/A";
    const studyDescription = study["00081030"]?.Value?.[0] || "N/A";
    const numberOfSeries = study["00201206"]?.Value?.[0] || 0;
    const numberOfInstances = study["00201208"]?.Value?.[0] || 0;
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";

    const {
        toggleStudySelection,
        isStudySelected,
        selectStudy,
        clearSelection
    } = useDicomStudySelectionStore();

    const isSelected = isStudySelected(studyInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getShareStudyThumbnailQuery({
            token,
            password,
            studyInstanceUid,
            viewport: "224,224",
        })
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        getTargetShareTagsQuery(token, "study", studyInstanceUid, password ?? undefined)
    );

    const handleDoubleClick = () => {
        const params = password ? `?password=${encodeURIComponent(password)}` : "";
        router.push(`/${lng}/share/${token}/studies/${studyInstanceUid}${params}`);
    };

    const { handleCardClick, handleContextMenu, handleDoubleClick: onDoubleClick } = useDicomCardSelection({
        itemId: studyInstanceUid,
        isSelected,
        toggleSelection: toggleStudySelection,
        selectItem: selectStudy,
        clearSelection,
        onDoubleClick: handleDoubleClick
    });

    return (
        <SharedDicomStudyContextMenu
            token={token}
            password={password}
            studyInstanceUid={studyInstanceUid}
            publicPermissions={publicPermissions}
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
                onDoubleClick={onDoubleClick}
            >
                <DicomCardHeaderTagsDisplay 
                    tags={tags?.data ?? []}
                    isLoadingTags={isLoadingTags}
                    isSelected={isSelected}
                    maxTagDisplay={2}
                />

                {/* Thumbnail */}
                <div className="aspect-square w-full bg-gray-100 flex items-center justify-center">
                    {isLoadingThumbnail ? (
                        <Skeleton className="w-full h-full" />
                    ) : thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt="DICOM Study Thumbnail"
                            width={224}
                            height={224}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FolderIcon className="h-12 w-12 opacity-50" />
                            <div className="text-xs">
                                {numberOfSeries} series • {numberOfInstances} images
                            </div>
                        </div>
                    )}
                </div>

                <CardContent className="pt-4">
                    <div className="space-y-2">
                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.study.patientId")}:
                            </span>
                            <div className="text-foreground truncate font-medium">
                                {patientId}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.study.patientName")}:
                            </span>
                            <div className="text-foreground truncate">
                                {patientName}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.study.studyDate")}:
                            </span>
                            <div className="text-foreground truncate">
                                {studyDate}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.study.description")}:
                            </span>
                            <div className="text-foreground truncate">
                                {studyDescription}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.study.accessionNumber")}:
                            </span>
                            <div className="text-foreground truncate">
                                {accessionNumber}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </SharedDicomStudyContextMenu>
        
    );
}