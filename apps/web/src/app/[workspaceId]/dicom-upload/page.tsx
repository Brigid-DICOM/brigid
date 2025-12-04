import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import DicomUploadContent from "./content";

interface DicomUploadPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export default async function DicomUploadPage({ params }: DicomUploadPageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    const session = await queryClient.fetchQuery(
        authSessionQuery(cookieStore.toString()),
    );

    if (!session) {
        return redirect("/api/auth/signin");
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomUploadContent workspaceId={workspaceId} />
        </HydrationBoundary>
    );
}
