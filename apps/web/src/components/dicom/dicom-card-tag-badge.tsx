"use client";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface TagData {
    id: string;
    name: string;
    color: string;
}

interface CardTagBadgeProps {
    tags: TagData[];
    maxDisplay?: number;
    className?: string;
    size?: "sm" | "md";
}

export function DicomCardTagBadge({
    tags,
    maxDisplay = 3,
    className,
    size = "sm",
}: CardTagBadgeProps) {
    if (!tags || tags.length === 0) return null;

    const displayedTags = tags.slice(0, maxDisplay);
    const remainingCount = tags.length - maxDisplay;
    const hasRemaining = remainingCount > 0;

    const sizeClasses = {
        sm: "px-1.5 py-0.5 text-xs",
        md: "px-2 py-1 text-sm",
    };

    return (
        <div className={cn("flex items-center gap-1 flex-wrap", className)}>
            {displayedTags.map((tag) => (
                <div
                    key={tag.id}
                    className={cn(
                        "rounded-full font-medium text-white truncate",
                        sizeClasses[size],
                    )}
                    style={{ backgroundColor: tag.color }}
                    title={tag.name}
                >
                    {tag.name}
                </div>
            ))}

            {/* 如果有剩餘的 tags，顯示 +N 的 badge */}
            {hasRemaining && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div
                            className={cn(
                                "rounded-full font-medium",
                                "bg-gray-300 text-gray-700 cursor-pointer hover:bg-gray-400 transition-colors",
                                sizeClasses[size],
                            )}
                        >
                            +{remainingCount}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="min-h-9">
                        <div className="space-y-1">
                            {tags.slice(maxDisplay).map((tag) => (
                                <div
                                    key={tag.id}
                                    className="flex items-center gap-2"
                                >
                                    <div
                                        className={cn(
                                            "rounded-full font-medium truncate",
                                            sizeClasses[size],
                                        )}
                                        style={{ backgroundColor: tag.color }}
                                    >
                                        <span>{tag.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )}
        </div>
    );
}
