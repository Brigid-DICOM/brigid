import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import { getDicomStatsQuery } from "@/react-query/queries/stats";
import HomeContent from "./content";

interface HomePageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function Home({ params }: HomePageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const session = await queryClient.fetchQuery(
        authSessionQuery(cookieStore.toString()),
    );
    await queryClient.prefetchQuery(
        getDicomStatsQuery({
            workspaceId: workspaceId,
            cookie: cookieStore.toString(),
        }),
    );

    if (!session) {
        return redirect("/api/auth/signin");
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HomeContent />
        </HydrationBoundary>
    );
}
