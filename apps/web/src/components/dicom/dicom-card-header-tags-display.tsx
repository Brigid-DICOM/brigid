"use client";

import type { InferResponseType } from "hono";
import { CheckIcon } from "lucide-react";
import type  { apiClient } from "@/react-query/apiClient";
import { Skeleton } from "../ui/skeleton";
import { DicomCardTagBadge } from "./dicom-card-tag-badge";

type ApiClient = typeof apiClient;

type TagResponse = InferResponseType<
    ApiClient["api"]["workspaces"][":workspaceId"]["tags"][":targetType"][":targetId"]["$get"]
>;

type ResponseTagData = TagResponse["data"][number] | undefined;

interface DicomCardHeaderTagsDisplayProps {
    tags?: ResponseTagData[];
    isLoadingTags?: boolean;
    isSelected?: boolean;
    maxTagDisplay?: number;
}

export function DicomCardHeaderTagsDisplay(props: DicomCardHeaderTagsDisplayProps) {
    const { tags, isLoadingTags, isSelected, maxTagDisplay = 2 } = props;

    if (!tags) return null;

    const tagData = tags.map((tag) => ({
        id: tag?.id ?? "",
        name: tag?.name ?? "",
        color: tag?.color ?? "",
    }));

    return (
        <div className="flex items-stretch justify-between px-2 py-1.5 bg-white/50 backdrop-blur-sm border-b border-gray-100 leading-none">
            <div className="flex-1 flex min-w-0 items-center">
                <DicomCardTagBadge tags={tagData} maxDisplay={maxTagDisplay} />

                {isLoadingTags && (
                    <Skeleton className="h-5 w-7 rounded-full" />
                )}

                {!isLoadingTags && !tagData.length && (
                    <div className="h-5" />
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
    )
}