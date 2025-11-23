import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomStudiesContent from "./content";

export default async function DicomStudiesPage() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery(
        cookieStore.toString()
    ));

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomStudiesContent workspaceId={defaultWorkspace?.workspace?.id ?? ""} />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}