import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import type { ConvertOptions } from "@/server/types/dicom/convert";

export function toConvertOptions(qs: Record<string, string>): ConvertOptions {
    const parsed = wadoRsQueryParamSchema.parse(qs);

    const windowWidth = parsed.window?.split(",")?.at(1) ? Number(parsed.window?.split(",")?.at(1)) : undefined;
    const windowCenter = parsed.window?.split(",")?.at(0) ? Number(parsed.window?.split(",")?.at(0)) : undefined;

    let resizeWidth: number | undefined;
    let resizeHeight: number | undefined;
    let cropX: number | undefined;
    let cropY: number | undefined;
    let cropWidth: number | undefined;
    let cropHeight: number | undefined;
    if (parsed.viewport) {
        const [vw, vh, sx, sy, sw, sh] = parsed.viewport.split(",").map(Number);
        resizeWidth = vw;
        resizeHeight = vh;
        // TODO: support sx, sy (point), sw, sh (size), If sw is a negative value, the image is flipped horizontally. If sh is a negative value, the image is flipped vertically.

        cropX = sx || 0;
        cropY = sy || 0;

        cropWidth = sw || resizeWidth;
        cropHeight = sh || resizeHeight;
    }

    return {
        quality: parsed.quality,
        windowWidth,
        windowCenter,
        voiLutFunction: parsed.window?.split(",")?.at(2) as "linear" | "linear-exact" | "sigmoid" | undefined,
        profile: parsed.iccprofile,
        resize: resizeWidth && resizeHeight ? {
            width: resizeWidth,
            height: resizeHeight
        } : undefined,
        crop: cropX !== undefined && cropY !== undefined && cropWidth !== undefined && cropHeight !== undefined ? {
            x: cropX,
            y: cropY,
            width: cropWidth,
            height: cropHeight
        } : undefined,
        frameNumber: parsed.frameNumber
    }
}