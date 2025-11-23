import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import { getDicomStatsQuery } from "@/react-query/queries/stats";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import HomeContent from "./content";

export default async function Home() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const session = await queryClient.fetchQuery(
        authSessionQuery(cookieStore.toString()),
    );
    const defaultWorkspace = await queryClient.fetchQuery(
        getDefaultWorkspaceQuery(cookieStore.toString()),
    );
    await queryClient.prefetchQuery(
        getDefaultWorkspaceQuery(cookieStore.toString()),
    );
    await queryClient.prefetchQuery(
        getDicomStatsQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
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
