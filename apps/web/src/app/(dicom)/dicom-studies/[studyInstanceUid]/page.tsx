import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomSeriesContent from "./content";

interface DicomSeriesPageProps {
    params: Promise<{
        studyInstanceUid: string;
    }>;
}

export default async function DicomSeriesPage({ params }: DicomSeriesPageProps) {
    const cookieStore = await cookies();
    const { studyInstanceUid } = await params;

    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery(
        cookieStore.toString()
    ));

    await queryClient.prefetchQuery(
        getDicomSeriesQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
            studyInstanceUid: studyInstanceUid,
            offset: 0,
            limit: 10,
            cookie: cookieStore.toString()
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomSeriesContent 
                workspaceId={defaultWorkspace?.workspace?.id ?? ""} 
                studyInstanceUid={studyInstanceUid} 
            />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}