import type { OutputFormat } from "@/server/types/dicom/convert";

export function resolveOutputFormat(acceptType?: string): OutputFormat | null {
    if (!acceptType) return null;
    if (acceptType.includes("image/jpeg")) return "jpeg";
    if (acceptType.includes("image/jp2")) return "jp2";
    if (acceptType.includes("image/png")) return "png";
    if (acceptType.includes("application/octet-stream")) return "raw";
    return null;
}
