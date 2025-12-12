"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ShareLinkCard } from "@/components/share/share-link-card";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserShareLinksQuery } from "@/react-query/queries/share";

interface MySharesContentProps {
    workspaceId: string;
}

export default function MySharesContent({ workspaceId }: MySharesContentProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, isLoading, isFetching, refetch } = useQuery(
        getUserShareLinksQuery({
            workspaceId,
            page,
            limit: LIMIT
        })
    );

    const shareLinks = data?.data?.shareLinks ?? [];
    const hasNextPage = data?.data?.hasNextPage ?? false;

    const handleRefresh = () => {
        refetch();
    }

    const handleShareDeleted = () => {
        queryClient.invalidateQueries({
            queryKey: ["user-share-links", workspaceId],
        });
    }

    return (
        <div className="container mx-auto space-y-4 py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                    {t("myShares.title")}
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isFetching}
                    title={t("myShares.refresh")}
                >
                    <RefreshCcwIcon className="size-4" />
                </Button>
            </div>

            {/* Content */}
            {isLoading ? (
                 <div className="flex items-center justify-center py-8">
                    <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
                 </div>
            ): shareLinks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                    {t("myShares.noData")}
                </div>
            ): (
                <>
                {/* Grid Layout for Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shareLinks.map((shareLink) => (
                            <ShareLinkCard
                                key={shareLink.id}
                                shareLink={{
                                    id: shareLink.id,
                                    name: shareLink.name ?? undefined,
                                    token: shareLink.token,
                                    accessCount: shareLink.accessCount,
                                    publicPermissions: shareLink.publicPermissions,
                                    requiredPassword: shareLink.requiredPassword,
                                    expiresInSec: shareLink.expiresInSec ?? undefined,
                                    expiresAt: shareLink.expiresAt ? new Date(shareLink.expiresAt) : undefined,
                                    recipients: shareLink.recipients.map((recipient) => ({
                                        userId: recipient.userId,
                                        user: {
                                            id: recipient.user.id ?? "",
                                            name: recipient.user.name ?? "",
                                            email: recipient.user.email ?? "",
                                            image: recipient.user.image ?? undefined,
                                        },
                                        permissions: recipient.permissions,
                                    })),
                                    createdAt: new Date(shareLink.createdAt),
                                    targets: shareLink.targets.map((target) => ({
                                        id: target.id,
                                        targetType: target.targetType as "study" | "series" | "instance",
                                        targetId: target.targetId,
                                    })),
                                    creatorId: shareLink.creatorId,
                                    description: shareLink.description ?? undefined,
                                }}
                                workspaceId={workspaceId}
                                onDeleted={handleShareDeleted}
                            />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <PaginationControls
                        canGoPrevious={page > 1}
                        canGoNext={hasNextPage}
                        onPrevious={() => setPage(page - 1)}
                        onNext={() => setPage(page + 1)}
                    />
                </>
            )}
        </div>
    )
}