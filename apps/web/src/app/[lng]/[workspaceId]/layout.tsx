import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { DownloadTaskList } from "@/components/download/download-task-list";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UploadTaskList } from "@/components/upload/upload-task-list";
import { WorkspaceStoreInitializer } from "@/components/workspace-store-initializer";
import { getQueryClient } from "@/react-query/get-query-client";
import { getWorkspaceByIdQuery } from "@/react-query/queries/workspace";

interface DicomLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        workspaceId: string;
    }>
}

export default async function DicomLayout({ children, params }: DicomLayoutProps) {
    const { workspaceId } = await params;

    const queryClient = getQueryClient();
    const cookieStore = await cookies();

    try {
        await queryClient.fetchQuery(
            getWorkspaceByIdQuery(workspaceId, cookieStore.toString())
        )
    } catch {
        notFound();
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />

            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <WorkspaceStoreInitializer workspaceId={workspaceId} />
                        {children}
                        <DownloadTaskList />
                        <UploadTaskList />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
