import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import DicomSeriesContent from "./content";

interface DicomSeriesPageProps {
    params: Promise<{
        workspaceId: string;
        studyInstanceUid: string;
    }>;
}

export default async function DicomSeriesPage({
    params,
}: DicomSeriesPageProps) {
    const cookieStore = await cookies();
    const { studyInstanceUid, workspaceId } = await params;

    const queryClient = getQueryClient();

    await queryClient.prefetchQuery(
        getDicomSeriesQuery({
            workspaceId: workspaceId,
            studyInstanceUid: studyInstanceUid,
            offset: 0,
            limit: 10,
            cookie: cookieStore.toString(),
        }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomSeriesContent
                workspaceId={workspaceId}
                studyInstanceUid={studyInstanceUid}
            />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}
