import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import DicomRecycleSeriesContent from "./content";

interface DicomRecycleSeriesPageProps {
    params: Promise<{
        workspaceId: string;
        studyInstanceUid: string;
    }>;
}

export default async function DicomRecycleSeriesPage({
    params,
}: DicomRecycleSeriesPageProps) {
    const cookieStore = await cookies();
    const { studyInstanceUid, workspaceId } = await params;
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getDicomSeriesQuery({
            workspaceId: workspaceId,
            studyInstanceUid: studyInstanceUid,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            instanceDeleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            cookie: cookieStore.toString(),
        }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomRecycleSeriesContent
                workspaceId={workspaceId}
                studyInstanceUid={studyInstanceUid}
            />
        </HydrationBoundary>
    );
}
