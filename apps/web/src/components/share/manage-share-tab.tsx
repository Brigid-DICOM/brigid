"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, isPast } from "date-fns";
import {
    ClockIcon,
    CopyIcon,
    EditIcon,
    EyeIcon,
    LockIcon,
    Trash2Icon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { usePagination } from "@/hooks/use-pagination";
import { getQueryClient } from "@/react-query/get-query-client";
import { getTargetShareLinksQuery } from "@/react-query/queries/share";
import { PaginationControls } from "../common/pagination-controls";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ShareDeleteConfirmDialog } from "./share-delete-confirm-dialog";
import { ShareLinkEditForm } from "./share-link-edit-form";

interface ManageShareTabProps {
    workspaceId: string;
    targetType: "study" | "series" | "instance";
    targetIds: string[];
}

interface ShareLink {
    id: string;
    creatorId: string;
    name?: string;
    token: string;
    publicPermissions: number;
    requiredPassword: boolean;
    expiresInSec?: number;
    expiresAt?: Date;
    accessCount: number;
    description?: string;
    recipients: Array<{
        userId: string;
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        };
        permissions: number;
    }>;
}

export function ManageShareTab({
    workspaceId,
    targetType,
    targetIds,
}: ManageShareTabProps) {
    const { lng } = useParams<{ lng: string }>();
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [editingShare, setEditingShare] = useState<ShareLink | null>(null);
    const [targetIdToDelete, setTargetIdToDelete] = useState<string | null>(
        null,
    );
    const [showDeleteConfirmDialogOpen, setShowDeleteConfirmDialogOpen] =
        useState(false);
    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } =
        usePagination();

    const { data: shareLinks, isLoading } = useQuery(
        getTargetShareLinksQuery({
            targetType,
            targetIds: targetIds,
            workspaceId,
            limit: 10,
            page: currentPage + 1,
        }),
    );

    const canGoNext = !!shareLinks?.data.hasNextPage;

    const copyShareLink = (token: string) => {
        const shareUrl = `${window.location.origin}/${lng}/share/${token}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
    };

    const isExpired = (expiresAt: Date | undefined) => {
        if (!expiresAt) return false;
        return isPast(new Date(expiresAt));
    };

    if (!editingShare) {
        return (
            <div className="space-y-4 py-4">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                        Loading share links...
                    </div>
                ) : shareLinks?.data.shareLinks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No share links yet. Create one in the "Create Share"
                        tab.
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {shareLinks?.data.shareLinks.map((share) => {
                            const expired = isExpired(
                                share.expiresAt
                                    ? new Date(share.expiresAt)
                                    : undefined,
                            );

                            return (
                                <div
                                    key={share.id}
                                    className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            {/* share link info */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                                                    {share.token.slice(0, 8)}...
                                                </code>

                                                {expired && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                        Expired
                                                    </span>
                                                )}

                                                {share.requiredPassword && (
                                                    <LockIcon className="w-3 h-3 text-gray-500" />
                                                )}

                                                {share.publicPermissions ===
                                                0 ? (
                                                    <Badge variant="outline">
                                                        Private
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-500 text-white"
                                                    >
                                                        Public
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* share description */}
                                            {share.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                                    {share.description}
                                                </p>
                                            )}

                                            {/* metadata */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <EyeIcon className="w-3 h-3" />
                                                    {share.accessCount} views
                                                </span>

                                                {share.expiresAt && (
                                                    <span
                                                        className={`flex items-center gap-1 ${
                                                            expired
                                                                ? "text-red-500"
                                                                : ""
                                                        }`}
                                                    >
                                                        <ClockIcon className="w-3 h-3" />
                                                        {expired
                                                            ? "Expired"
                                                            : `Expires ${formatDistanceToNow(
                                                                  new Date(
                                                                      share.expiresAt,
                                                                  ),
                                                                  {
                                                                      addSuffix: true,
                                                                  },
                                                              )}`}
                                                    </span>
                                                )}

                                                {share.recipients.length >
                                                    0 && (
                                                    <span>
                                                        {
                                                            share.recipients
                                                                .length
                                                        }{" "}
                                                        recipient
                                                        {share.recipients
                                                            .length > 1
                                                            ? "s"
                                                            : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* action buttons */}
                                        <div className="flex gap-1 flex-shrink-0">
                                            <Button
                                                variant={"ghost"}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyShareLink(share.token);
                                                }}
                                                title="Copy Share Link"
                                            >
                                                <CopyIcon className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingShare(
                                                        share as ShareLink,
                                                    );
                                                }}
                                                title="Edit share link"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTargetIdToDelete(
                                                        share.id,
                                                    );
                                                    setShowDeleteConfirmDialogOpen(
                                                        true,
                                                    );
                                                }}
                                                title="Delete share link"
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {targetIdToDelete && (
                    <ShareDeleteConfirmDialog
                        open={showDeleteConfirmDialogOpen}
                        onOpenChange={setShowDeleteConfirmDialogOpen}
                        shareLinkId={targetIdToDelete}
                        workspaceId={workspaceId}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: [
                                    "share-links",
                                    targetType,
                                    targetIds.join(","),
                                    workspaceId,
                                ],
                            });
                            queryClient.invalidateQueries({
                                queryKey: [
                                    "share-link-count",
                                    targetType,
                                    targetIds.join(","),
                                    workspaceId,
                                ],
                            });
                            setShowDeleteConfirmDialogOpen(false);
                            setTargetIdToDelete(null);
                        }}
                    />
                )}

                <PaginationControls
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                    onPrevious={handlePreviousPage}
                    onNext={handleNextPage}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6 py-4 max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("shareLink.editDialog.title")}</h3>
                <p className="text-xs text-gray-500 mt-1">
                    Token: {editingShare.token.slice(0, 16)}...
                </p>
            </div>

            <ShareLinkEditForm 
                shareLink={editingShare}
                workspaceId={workspaceId}
                onSuccess={() => {
                    setEditingShare(null);
                }}
                onCancel={() => {
                    setEditingShare(null);
                }}
            />
        </div>
    );
}
