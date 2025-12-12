import {
    dehydrate,
    HydrationBoundary,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getShareStudySeriesInstancesQuery } from "@/react-query/queries/publicShare";
import ShareStudySeriesInstancesContent from "./content";

interface ShareStudySeriesInstancesPageProps {
    params: Promise<{
        token: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
    }>

    searchParams: Promise<{
        password?: string;
    }>
}

export default async function ShareStudySeriesInstancesPage({ params, searchParams }: ShareStudySeriesInstancesPageProps) {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const { token, studyInstanceUid, seriesInstanceUid } = await params;
    const { password } = await searchParams;

    await queryClient.prefetchQuery(
        getShareStudySeriesInstancesQuery({
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            offset: 0,
            limit: 10,
            cookie: cookieStore.toString()
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ShareStudySeriesInstancesContent 
                token={token}
                studyInstanceUid={studyInstanceUid}
                seriesInstanceUid={seriesInstanceUid}
                password={password}
            />

            <BlueLightViewerDialog />
        </HydrationBoundary>
    )
}