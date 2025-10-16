import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import { wadoUriQueryParamSchema } from "@/server/schemas/wadoUri";
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

export function wadoUriParamsToConvertOptions(qs: Record<string, string>): ConvertOptions {
    const parsed = wadoUriQueryParamSchema.parse(qs);

    let resizeWidth: number | undefined;
    let resizeHeight: number | undefined;
    let region: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    } | undefined;
    let windowCenter: number | undefined;
    let windowWidth: number | undefined;
    if (parsed.row) {
        resizeWidth = Number(parsed.row);
    }
    if (parsed.column) {
        resizeHeight = Number(parsed.column);
    }

    if (parsed.region) {
        const [xmin, ymin, xmax, ymax] = parsed.region.split(",").map(Number);
        region = {
            xmin: xmin,
            ymin: ymin,
            xmax: xmax,
            ymax: ymax
        };
    }

    if (parsed.windowCenter) {
        windowCenter = Number(parsed.windowCenter);
    }
    if (parsed.windowWidth) {
        windowWidth = Number(parsed.windowWidth);
    }
    return {
        windowWidth,
        windowCenter,
        resize: resizeWidth && resizeHeight ? {
            width: resizeWidth,
            height: resizeHeight
        } : undefined,
        region,
        frameNumber: parsed.frameNumber,
        quality: parsed.imageQuality,
        profile: parsed.iccprofile
    }
}