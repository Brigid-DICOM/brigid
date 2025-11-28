import Link from "next/link";
import { DownloadTaskList } from "@/components/download/download-task-list";
import Providers from "../providers";

interface ShareLayoutProps {
    children: React.ReactNode;
}

export default function ShareLayout({ children }: ShareLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
            <Providers>
                {/* Header */}
                <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">
                                Brigid
                            </span>
                            <span className="text-sm text-muted-foreground">
                                Shared Content
                            </span>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto py-8 flex-1">
                    {children}
                    <DownloadTaskList />
                </main>

                {/* Footer */}
                <footer className="border-t bg-white/50">
                    <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
                        Powered by Brigid DICOM Platform
                    </div>
                </footer>
            </Providers>
        </div>
    );
}
