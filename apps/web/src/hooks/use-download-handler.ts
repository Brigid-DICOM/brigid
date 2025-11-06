import { toast } from "sonner";

interface UseDownloadHandlerProps {
    downloadSingle: (id: string) => Promise<string>;
    downloadMultiple: (ids: string[]) => Promise<string[]>;
    errorMessage?: string;
}

export function useDownloadHandler({
    downloadSingle,
    downloadMultiple,
    errorMessage,
}: UseDownloadHandlerProps) {
    const handleDownload = async (ids: string[]) => {
        if (ids.length === 0) return;

        try {
            if (ids.length === 1) {
                await downloadSingle(ids[0]);
            } else {
                await downloadMultiple(ids);
            }
        } catch (error) {
            console.error("Failed to download", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(errorMessage || "Failed to download");
        }
    };

    return {
        handleDownload,
    };
}
