import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomInstancesSeriesContent from "./content";

interface DicomInstancesSeriesPageProps {
    params: Promise<{
        studyInstanceUid: string;
    }>;
}

export default async function DicomInstancesSeriesPage({ params }: DicomInstancesSeriesPageProps) {
    const { studyInstanceUid } = await params;

    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery());

    await queryClient.prefetchQuery(
        getDicomSeriesQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
            studyInstanceUid: studyInstanceUid,
            offset: 0,
            limit: 10,
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomInstancesSeriesContent 
                workspaceId={defaultWorkspace?.workspace?.id ?? ""} 
                studyInstanceUid={studyInstanceUid} 
            />
        </HydrationBoundary>
    );
}