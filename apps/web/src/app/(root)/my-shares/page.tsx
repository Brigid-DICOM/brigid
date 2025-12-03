import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getUserShareLinksQuery } from "@/react-query/queries/share";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import MySharesContent from "./content";

export default async function MySharesPage() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery(
        cookieStore.toString()
    ));
    await queryClient.prefetchQuery(
        getUserShareLinksQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
            page: 1,
            limit: 10,
            cookie: cookieStore.toString(),
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <MySharesContent workspaceId={defaultWorkspace?.workspace?.id ?? ""} />
        </HydrationBoundary>
    )
}