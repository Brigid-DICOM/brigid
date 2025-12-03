import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserReceivedShareLinksQuery } from "@/react-query/queries/share";
import ShareWithMeContent from "./content";

export default async function ShareWithMePage() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getUserReceivedShareLinksQuery({
            page: 1,
            limit: 10,
            cookie: cookieStore.toString(),
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ShareWithMeContent />
        </HydrationBoundary>
    )
}