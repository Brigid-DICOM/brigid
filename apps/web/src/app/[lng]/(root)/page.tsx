import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";

interface RootPageProps {
    params: Promise<{
        lng: string;
    }>;
}

export default async function RootPage({ params }: RootPageProps) {
    const { lng } = await params;
    const queryClient = getQueryClient();
    const cookieStore = await cookies();

    let redirectUrl = "/api/auth/signin";
    try {
        const data = await queryClient.fetchQuery(
            getDefaultWorkspaceQuery(cookieStore.toString())
        );

        const defaultId = data?.workspace?.id
        
        if (defaultId) {
            redirectUrl = `/${lng}/${defaultId}`;
        }
    } catch {
        // go to signin page
        redirect(redirectUrl);
    } finally {
        // go to workspace root page (dashboard)
        redirect(redirectUrl);
    }
}