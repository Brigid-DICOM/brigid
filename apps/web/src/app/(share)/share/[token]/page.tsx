import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/react-query/get-query-client";
import ShareContent from "./content";

interface ShareViewerPageProps {
    params: Promise<{ token: string }>;
    searchParams: Promise<{ password?: string }>;
}

export default async function ShareViewerPage({ params, searchParams }: ShareViewerPageProps) {
    const queryClient = getQueryClient();
    const { token } = await params;
    const { password } = await searchParams;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ShareContent
                token={token}
                initialPassword={password}
            />
        </HydrationBoundary>
    )
}