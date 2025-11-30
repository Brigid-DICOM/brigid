import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomInstanceQuery } from "@/react-query/queries/dicomInstance";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomInstancesContent from "./content";

interface DicomInstancesPageProps {
    params: Promise<{
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }>;
}

export default async function DicomInstancesSeriesPage({ params }: DicomInstancesPageProps) {
    const cookieStore = await cookies();
    const { studyInstanceUid, seriesInstanceUid } = await params;

    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery(
        cookieStore.toString()
    ));

    await queryClient.prefetchQuery(
        getDicomInstanceQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
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
                workspaceId={defaultWorkspace?.workspace?.id ?? ""} 
                studyInstanceUid={studyInstanceUid}
                seriesInstanceUid={seriesInstanceUid}
            />

            <BlueLightViewerDialog />
        </HydrationBoundary>
    );
}