import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import Forbidden from "@/components/common/forbidden";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserShareLinksQuery } from "@/react-query/queries/share";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import MySharesContent from "./content";

interface MySharesPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function MySharesPage({ params }: MySharesPageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getUserShareLinksQuery({
            workspaceId: workspaceId,
            page: 1,
            limit: 10,
            cookie: cookieStore.toString(),
        }),
    );
    const workspaceData = await queryClient.fetchQuery(
        getWorkspaceByIdQuery(workspaceId, cookieStore.toString()),
    );

    const canShare = hasPermission(
        workspaceData?.workspace?.membership?.permissions ?? 0,
        WORKSPACE_PERMISSIONS.MANAGE,
    );

    if (!canShare) {
        return <Forbidden />;
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MySharesContent workspaceId={workspaceId} />
        </HydrationBoundary>
    );
}
