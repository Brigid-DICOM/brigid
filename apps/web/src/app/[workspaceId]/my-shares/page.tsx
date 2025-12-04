import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserShareLinksQuery } from "@/react-query/queries/share";
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
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MySharesContent workspaceId={workspaceId} />
        </HydrationBoundary>
    )
}