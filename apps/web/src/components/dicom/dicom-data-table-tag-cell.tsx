"use client";

import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { useQuery } from "@tanstack/react-query";
import { getTargetShareTagsQuery } from "@/react-query/queries/share-tag";
import { getTargetTagsQuery } from "@/react-query/queries/tag";
import { Skeleton } from "../ui/skeleton";
import { DicomCardTagBadge } from "./dicom-card-tag-badge";

type DicomDataTableTagCellProps = 
| {
    mode: "workspace";
    workspaceId: string;
    targetType: TagTargetType;
    targetId: string;
    maxDisplay?: number;
    className?: string;
}
| {
    mode: "share";
    token: string;
    targetType: TagTargetType;
    targetId: string;
    password?: string;
    maxDisplay?: number;
    className?: string;
};

export function DicomDataTableTagCell(props: DicomDataTableTagCellProps) {
    const {
        mode,
        targetType,
        targetId,
        maxDisplay = 2,
        className,
    } = props;

    const { data: tags, isLoading: isLoadingTags } = useQuery(
        mode === "workspace" ? 
        getTargetTagsQuery(props.workspaceId, targetType, targetId) : 
        getTargetShareTagsQuery(props.token, targetType, targetId, props.password ?? undefined),
    );

    if (isLoadingTags) {
        return (
            <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-7 rounded-full" />
            </div>
        );
    }

    if (!tags?.data || tags?.data.length === 0) {
        return <div className="text-sm text-gray-400">-</div>;
    }

    return (
        <DicomCardTagBadge
            tags={tags?.data ?? []}
            maxDisplay={maxDisplay}
            className={className}
            size="sm"
        />
    );
}
