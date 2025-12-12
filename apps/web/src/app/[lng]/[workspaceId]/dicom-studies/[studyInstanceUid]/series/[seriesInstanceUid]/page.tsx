import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomInstanceQuery } from "@/react-query/queries/dicomInstance";
import DicomInstancesContent from "./content";

interface DicomInstancesPageProps {
    params: Promise<{
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }>;
}

export default async function DicomInstancesSeriesPage({ params }: DicomInstancesPageProps) {
    const cookieStore = await cookies();
    const { studyInstanceUid, seriesInstanceUid, workspaceId } = await params;

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(
        getDicomInstanceQuery({
            workspaceId: workspaceId,
            studyInstanceUid: studyInstanceUid,
            seriesInstanceUid: seriesInstanceUid,
            offset: 0,
            limit: 10,
            cookie: cookieStore.toString()
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomInstancesContent 
                workspaceId={workspaceId} 
                studyInstanceUid={studyInstanceUid}
                seriesInstanceUid={seriesInstanceUid}
            />

            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}