import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import ShareContent from "./content";

interface ShareViewerPageProps {
    params: Promise<{ token: string }>;
}

export default async function ShareViewerPage({
    params,
}: ShareViewerPageProps) {
    const queryClient = getQueryClient();
    const { token } = await params;

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ShareContent token={token} />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}
