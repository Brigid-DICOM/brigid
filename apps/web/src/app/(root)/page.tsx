import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDefaultWorkspaceQuery } from "@/react-query/queries/workspace";

export default async function RootPage() {
    const queryClient = getQueryClient();
    const cookieStore = await cookies();

    let redirectUrl = "/api/auth/signin";
    try {
        const data = await queryClient.fetchQuery(
            getDefaultWorkspaceQuery(cookieStore.toString())
        );

        const defaultId = data?.workspace?.id
        
        if (defaultId) {
            redirectUrl = `/${defaultId}`;
        }
    } catch {
        // go to signin page
        redirect(redirectUrl);
    } finally {
        // go to workspace root page (dashboard)
        redirect(redirectUrl);
    }
}