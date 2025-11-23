import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomRecycleSeriesContent from "./content";

interface DicomRecycleSeriesPageProps {
    params: Promise<{
        studyInstanceUid: string;
    }>
}

export default async function DicomRecycleSeriesPage({ params }: DicomRecycleSeriesPageProps) {
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
            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            cookie: cookieStore.toString()
        })
    )

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomRecycleSeriesContent 
                workspaceId={defaultWorkspace?.workspace?.id ?? ""}
                studyInstanceUid={studyInstanceUid}
            />
        </HydrationBoundary>
    )
}