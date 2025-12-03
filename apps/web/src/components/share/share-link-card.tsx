"use client";

import { format } from "date-fns-tz";
import { EllipsisVerticalIcon, EyeIcon, FolderIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ShareLinkFormData } from "./share-link-edit-form";

const ShareLinkContextMenu = dynamic(
    () =>
        import("./share-link-context-menu").then(
            (mod) => mod.ShareLinkContextMenu,
        ),
    {
        ssr: false,
    },
);

const ShareLinkDropdownMenu = dynamic(
    () =>
        import("./share-link-dropdown-menu").then(
            (mod) => mod.ShareLinkDropdownMenu,
        ),
    {
        ssr: false,
    },
);

const ShareLinkDetailsDialog = dynamic(
    () =>
        import("./share-link-details-dialog").then(
            (mod) => mod.ShareLinkDetailsDialog,
        ),
    {
        ssr: false,
    },
);

interface ShareLinkData {
    id: string;
    name?: string;
    token: string;
    accessCount: number;
    createdAt: Date;
    publicPermissions: number;
    requiredPassword: boolean;
    expiresInSec?: number;
    expiresAt?: Date;
    recipients: ShareLinkFormData["recipients"];
    targets: Array<{
        id: string;
        targetType: "study" | "series" | "instance";
        targetId: string;
    }>;
    creatorId: string;
}

interface ShareLinkCardProps {
    shareLink: ShareLinkData;
    workspaceId: string;
    className?: string;
    onDeleted?: () => void;
}

export function ShareLinkCard({
    shareLink,
    workspaceId,
    onDeleted,
    className,
}: ShareLinkCardProps) {
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    const formattedDate = format(
        new Date(shareLink.createdAt),
        "yyyy/M/d a h:mm:ss",
    );

    const displayName =
        shareLink.name || `Shared ${shareLink.targets[0].targetType}`;

    return (
        <>
            <ShareLinkContextMenu
                workspaceId={workspaceId}
                shareLink={{
                    id: shareLink.id,
                    name: shareLink.name,
                    token: shareLink.token,
                    publicPermissions: shareLink.publicPermissions,
                    requiredPassword: shareLink.requiredPassword,
                    expiresInSec: shareLink.expiresInSec,
                    expiresAt: shareLink.expiresAt,
                    recipients: shareLink.recipients,
                    creatorId: shareLink.creatorId,
                }}
                onDeleted={onDeleted}
            >
                <div className={cn(
                    "relative",
                    className
                )}>
                    <button
                        type="button"
                        onClick={() => setShowDetailsDialog(true)}
                        className={cn(
                            "w-full flex items-center gap-4 p-4 text-left",
                            "bg-card rounded-lg",
                            "hover:bg-accent/50 transition-colors cursor-pointer",
                        )}
                    >
                        {/* Left: File Icon */}
                        <div className="flex-shrink-0">
                            <FolderIcon className="h-10 w-10 text-amber-500" />
                        </div>

                        {/* Center: Name & Created Time */}
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                                {displayName}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {formattedDate}
                            </div>
                        </div>

                        {/* Spacer for dropdown area */}
                        <div className="flex-shrink-0 flex flex-col items-end gap-1">
                            {/* Placeholder for dropdown button size */}
                            <div className="h-6 w-6" />
                            {/* Access Count */}
                            <div className="flex items-center gap-1 text-muted-foreground">
                                <EyeIcon className="h-4 w-4" />
                                <span className="text-sm">
                                    {shareLink.accessCount}
                                </span>
                            </div>
                        </div>
                    </button>

                    <div className="absolute top-4 right-4">
                        {/* Dropdown Menu Button */}
                        <ShareLinkDropdownMenu
                                shareLink={{
                                    id: shareLink.id,
                                    name: shareLink.name,
                                    token: shareLink.token,
                                    publicPermissions: shareLink.publicPermissions,
                                    requiredPassword: shareLink.requiredPassword,
                                    expiresInSec: shareLink.expiresInSec,
                                    expiresAt: shareLink.expiresAt,
                                    recipients: shareLink.recipients,
                                    creatorId: shareLink.creatorId,
                                }}
                                workspaceId={workspaceId}
                                onDeleted={onDeleted}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <EllipsisVerticalIcon className="h-4 w-4" />
                                </Button>
                            </ShareLinkDropdownMenu>
                    </div>
                </div>
            </ShareLinkContextMenu>

            <ShareLinkDetailsDialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
                name={displayName}
                targets={shareLink.targets}
                token={shareLink.token}
            />
        </>
    );
}
