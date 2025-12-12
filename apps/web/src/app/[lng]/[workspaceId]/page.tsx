import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { getT } from "@/app/_i18n";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomStatsQuery } from "@/react-query/queries/stats";
import HomeContent from "./content";

interface HomePageProps {
    params: Promise<{
        workspaceId: string;
    }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const { t } = await getT("translation");

    return {
        title: t("dashboard.title"),
        description: t("dashboard.description"),
    };
}

export default async function Home({ params }: HomePageProps) {
    const { workspaceId } = await params;
    const cookieStore = await cookies();
    const queryClient = getQueryClient();
    await queryClient.prefetchQuery(
        getDicomStatsQuery({
            workspaceId: workspaceId,
            cookie: cookieStore.toString(),
        }),
    );

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <HomeContent />
        </HydrationBoundary>
    );
}
