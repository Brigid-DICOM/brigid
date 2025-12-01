import { Loader2Icon } from "lucide-react";

export default function Loading() {
    return (
        <div className="px-4 py-8 min-h-[calc(100vh-65px)] flex items-center justify-center">
            <div className="flex items-center space-x-4">
                <Loader2Icon className="size-10 animate-spin" />
                <span className="text-lg font-medium">Loading...</span>
            </div>
        </div>
    );
}
