"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import { useT } from "@/app/_i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import { useDicomCardSelection } from "@/hooks/use-dicom-card-selection";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { cn } from "@/lib/utils";
import { getShareInstanceThumbnailQuery } from "@/react-query/queries/publicShare";
import { getTargetShareTagsQuery } from "@/react-query/queries/share-tag";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { DicomCardHeaderTagsDisplay } from "../dicom/dicom-card-header-tags-display";
import { Skeleton } from "../ui/skeleton";
import { SharedDicomInstanceContextMenu } from "./shared-dicom-instance-context-menu";

interface SharedDicomInstanceCardProps {
    instance: DicomInstanceData;
    studyInstanceUid?: string;
    seriesInstanceUid?: string;
    token: string;
    password?: string;
    className?: string;
    publicPermissions?: number;
}

export function SharedDicomInstanceCard({
    instance,
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    publicPermissions = 0,
    className,
}: SharedDicomInstanceCardProps) {
    const { t } = useT("translation");
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";
    const sopClassUid = instance["00080016"]?.Value?.[0] || "N/A";
    const instanceNumber = instance["00200013"]?.Value?.[0] || "N/A";
    const acquisitionDate = instance["00080022"]?.Value?.[0] || "N/A";
    const contentDate = instance["00080023"]?.Value?.[0] || "N/A";
    const rows = instance["00280010"]?.Value?.[0] || "N/A";
    const columns = instance["00280011"]?.Value?.[0] || "N/A";

    const studyUidFromInstance = instance["0020000D"]?.Value?.[0] as string | undefined;
    const seriesUidFromInstance = instance["0020000E"]?.Value?.[0] as string | undefined;
    const effectiveStudyUid = studyInstanceUid || studyUidFromInstance;
    const effectiveSeriesUid = seriesInstanceUid || seriesUidFromInstance;

    const {
        toggleInstanceSelection,
        isInstanceSelected,
        selectInstance,
        clearSelection,
    } = useDicomInstanceSelectionStore();

    const isSelected = isInstanceSelected(sopInstanceUid);

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getShareInstanceThumbnailQuery({
            token,
            password,
            studyInstanceUid: effectiveStudyUid || "N/A",
            seriesInstanceUid: effectiveSeriesUid || "N/A",
            sopInstanceUid,
            viewport: "224,224"
        })
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        getTargetShareTagsQuery(token, "instance", sopInstanceUid, password ?? undefined)
    )

    const { handleCardClick, handleContextMenu } = useDicomCardSelection({
        itemId: sopInstanceUid,
        isSelected,
        toggleSelection: toggleInstanceSelection,
        selectItem: selectInstance,
        clearSelection,
    });

    return (
        <SharedDicomInstanceContextMenu
            token={token}
            password={password}
            studyInstanceUid={effectiveStudyUid || "N/A"}
            seriesInstanceUid={effectiveSeriesUid || "N/A"}
            sopInstanceUid={sopInstanceUid}
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
                            alt="DICOM Instance Thumbnail"
                            width={224}
                            height={224}
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileIcon className="h-12 w-12 opacity-50" />
                            <div className="text-xs">
                                {rows !== "N/A" && columns !== "N/A"
                                    ? `${columns} × ${rows}`
                                    : "DICOM Instance"}
                            </div>
                        </div>
                    )}
                </div>

                <CardContent className="pt-4">
                    <div className="space-y-2">
                        {/* Instance Number Badge */}
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {t("dicom.columns.instance.number")}{instanceNumber}
                            </span>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.instance.sopInstanceUid")}:
                            </span>
                            <div className="text-foreground truncate text-xs font-mono">
                                {sopInstanceUid}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.instance.sopClassUid")}:
                            </span>
                            <div className="text-foreground truncate text-xs font-mono">
                                {sopClassUid}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.instance.acquisitionDate")}:
                            </span>
                            <div className="text-foreground truncate">
                                {acquisitionDate}
                            </div>
                        </div>

                        <div className="text-sm">
                            <span className="font-medium text-muted-foreground">
                                {t("dicom.columns.instance.contentDate")}:
                            </span>
                            <div className="text-foreground truncate">
                                {contentDate}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </SharedDicomInstanceContextMenu>
        
    );
}