import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomUploadContent from "./content";

export default async function DicomUploadPage() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const session = await queryClient.fetchQuery(authSessionQuery(cookieStore.toString()));
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery());

    if (!session) {
        return redirect("/api/auth/signin");
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomUploadContent workspaceId={defaultWorkspace?.workspace?.id} />
        </HydrationBoundary>
    )
}