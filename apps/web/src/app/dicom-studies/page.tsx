import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomStudiesContent from "./content";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";

export default async function DicomStudiesPage() {
    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomStudiesContent workspaceId={defaultWorkspace?.workspace?.id ?? ""} />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}