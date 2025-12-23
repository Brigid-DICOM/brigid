import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomStudyQuery } from "@/react-query/queries/dicomStudy";
import DicomRecycleStudiesContent from "./content";

interface DicomRecycleStudiesPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function DicomRecycleStudiesPage({
    params,
}: DicomRecycleStudiesPageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getDicomStudyQuery({
            workspaceId: workspaceId,
            offset: 0,
            limit: 10,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            instanceDeleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            cookie: cookieStore.toString(),
        }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomRecycleStudiesContent workspaceId={workspaceId} />
        </HydrationBoundary>
    );
}
