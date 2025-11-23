import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
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
            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            cookie: cookieStore.toString()
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