import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getEventLogsQuery } from "@/react-query/queries/eventLog";
import EventLogsContent from "./content";

interface EventLogsPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function EventLogsPage({ params }: EventLogsPageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getEventLogsQuery({
            workspaceId,
            cookie: cookieStore.toString(),
        }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <EventLogsContent workspaceId={workspaceId} />
        </HydrationBoundary>
    );
}