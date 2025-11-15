import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomInstanceQuery } from "@/react-query/queries/dicomInstance";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomRecycleInstancesContent from "./content";

interface DicomRecycleInstancesPageProps {
    params: Promise<{
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }>;
}

export default async function DicomRecycleInstancesPage({ params }: DicomRecycleInstancesPageProps) {
    const { studyInstanceUid, seriesInstanceUid } = await params;

    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery());

    await queryClient.prefetchQuery(
        getDicomInstanceQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
            studyInstanceUid: studyInstanceUid,
            seriesInstanceUid: seriesInstanceUid,
            offset: 0,
            limit: 10,
            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomRecycleInstancesContent
                workspaceId={defaultWorkspace?.workspace?.id ?? ""}
                studyInstanceUid={studyInstanceUid}
                seriesInstanceUid={seriesInstanceUid}
            />
        </HydrationBoundary>
    )
}