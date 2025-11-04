import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomInstancesContent from "./content";

export default async function DicomInstancesPage() {
    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomInstancesContent workspaceId={defaultWorkspace?.workspace?.id ?? ""} />
        </HydrationBoundary>
    );
}