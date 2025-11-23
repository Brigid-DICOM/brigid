import { AppSidebar } from "@/components/app-sidebar";
import { DownloadTaskList } from "@/components/download/download-task-list";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { UploadTaskList } from "@/components/upload/upload-task-list";

interface DicomLayoutProps {
    children: React.ReactNode;
}

export default function DicomLayout({ children }: DicomLayoutProps) {
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
                        {children}
                        <DownloadTaskList />
                        <UploadTaskList />
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
