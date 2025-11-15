// app/not-found.tsx

import { ArrowLeftIcon, FrownIcon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center p-4 sm:p-8 min-h-[calc(100vh-65px)]">
            <div className="max-w-xl w-full text-center p-8 sm:p-12 rounded-xl border border-border shadow-2xl shadow-primary/20 transition-all duration-500 bg-card text-card-foreground">
                <h2 className="text-8xl font-extrabold text-primary mb-6 animate-pulse-slow">
                    404
                </h2>

                <div className="inline-flex items-center justify-center p-4 mb-8 bg-muted text-muted-foreground rounded-full border border-border">
                    <FrownIcon className="w-12 h-12" />
                </div>

                <h3 className="text-2xl font-semibold mb-4">Page Not Found</h3>
                <p className="text-muted-foreground mb-8">
                    The page you are looking for does not exist.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300">
                    <ArrowLeftIcon className="size-4" />
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
