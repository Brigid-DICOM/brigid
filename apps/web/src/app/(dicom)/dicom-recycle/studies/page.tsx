import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomStudyQuery } from "@/react-query/queries/dicomStudy";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";
import DicomRecycleStudiesContent from "./content";

export default async function DicomRecycleStudiesPage() {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const defaultWorkspace = await queryClient.fetchQuery(getDefaultWorkspaceQuery(
        cookieStore.toString()
    ));
    await queryClient.prefetchQuery(
        getDicomStudyQuery({
            workspaceId: defaultWorkspace?.workspace?.id ?? "",
            offset: 0,
            limit: 10,
            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            cookie: cookieStore.toString()
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomRecycleStudiesContent workspaceId={defaultWorkspace?.workspace?.id ?? ""} />
        </HydrationBoundary>
    );
}