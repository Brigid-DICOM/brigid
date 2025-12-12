import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Forbidden from "@/components/common/forbidden";
import { getQueryClient } from "@/react-query/get-query-client";
import { authSessionQuery } from "@/react-query/queries/session";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { hasPermission } from "@/server/utils/workspacePermissions";
import DicomUploadContent from "./content";
import type { Metadata } from "next";
import { getT } from "@/app/_i18n";

interface DicomUploadPageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getT("translation");
    return {
        title: t("upload.title"),
        description: t("upload.description"),
    };
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

    const workspaceData = await queryClient.fetchQuery(getWorkspaceByIdQuery(workspaceId, cookieStore.toString()));

    if (!hasPermission(workspaceData?.workspace?.membership?.permissions ?? 0, WORKSPACE_PERMISSIONS.CREATE)) {
        return <Forbidden />;
    }

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <DicomUploadContent workspaceId={workspaceId} />
        </HydrationBoundary>
    );
}
