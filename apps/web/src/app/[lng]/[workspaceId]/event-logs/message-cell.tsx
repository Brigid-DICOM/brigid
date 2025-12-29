"use client";

import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";

export function EventLogMessageCell({ message }: { message: string }) {
    const { t } = useT("translation");
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 150;
    const shouldTruncate = message.length > maxLength;

    return (
        <div className="max-w-[500px] break-all">
            <p className="text-sm">
            {isExpanded ? message : `${message.substring(0, maxLength)}${shouldTruncate ? "..." : ""}`}
            </p>
            {shouldTruncate && (
                <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? t("eventLogs.hide") : t("eventLogs.showMore")}
                </Button>
            )}
        </div>
    )
}