import {
    dehydrate,
    HydrationBoundary,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { BlueLightViewerDialog } from "@/components/dicom/bluelight-viewer-dialog";
import { getQueryClient } from "@/react-query/get-query-client";
import { getShareStudySeriesQuery } from "@/react-query/queries/publicShare";
import ShareStudySeriesContent from "./content";


interface ShareStudySeriesPageProps {
    params: Promise<{
        token: string;
        studyInstanceUid: string;
    }>;

    searchParams: Promise<{
        password?: string;
    }>
}

export default async function ShareStudySeriesPage({ params, searchParams }: ShareStudySeriesPageProps) {
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const { token, studyInstanceUid } = await params;
    const { password } = await searchParams;

    await queryClient.prefetchQuery(
        getShareStudySeriesQuery({
            token,
            password,
            studyInstanceUid,
            offset: 0,
            limit: 10,
            cookie: cookieStore.toString()
        })
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ShareStudySeriesContent 
                token={token}
                studyInstanceUid={studyInstanceUid}
                password={password}
            />
            <BlueLightViewerDialog />
        </HydrationBoundary>
    )
}