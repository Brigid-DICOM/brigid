// 此頁面不受 workspace 影響，每個 workspace 內的 share with me 都是共通的

"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import { PaginationControls } from "@/components/common/pagination-controls";
import { ShareLinkCard } from "@/components/share/share-link-card";
import { Button } from "@/components/ui/button";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserReceivedShareLinksQuery, parseShareLinkFromApi } from "@/react-query/queries/share";

export default function ShareWithMeContent() {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [page, setPage] = useState(1);
    const LIMIT = 10;

    const { data, isLoading, isFetching, refetch } = useQuery(
        getUserReceivedShareLinksQuery({
            page,
            limit: LIMIT
        })
    );

    const shareLinks = (data?.data?.shareLinks ?? []).map(parseShareLinkFromApi);
    const hasNextPage = data?.data?.hasNextPage ?? false;


    const handleRefresh = () => {
        refetch();
    }

    const handleShareDeleted = () => {
        queryClient.invalidateQueries({
            queryKey: ["user-received-share-links", page, LIMIT],
        });
    }

    return (
        <div className="container mx-auto space-y-4 py-8 px-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">
                    {t("shareWithMe.title")}
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRefresh}
                    disabled={isFetching}
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
                    {t("shareWithMe.noData")}
                </div>
            ): (
                <>
                    {/* Grid Layout for Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shareLinks.map((shareLink) => (
                            <ShareLinkCard
                                key={shareLink.id}
                                shareLink={shareLink}
                                // 這裡的 workspace id 必須是 share link 的 workspace id，因為每個 share link 都可能來自不同的 workspace
                                workspaceId={shareLink.workspaceId}
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