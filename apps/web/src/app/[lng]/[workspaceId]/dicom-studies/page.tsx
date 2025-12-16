import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import DicomStudiesContent from "./content";

interface DicomStudiesPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function DicomStudiesPage({
    params,
}: DicomStudiesPageProps) {
    const queryClient = getQueryClient();
    const { workspaceId } = await params;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomStudiesContent workspaceId={workspaceId} />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}
