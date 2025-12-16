import { z } from "zod";
import { positiveNumberQuerySchema } from "./positiveNumberQuerySchema";

export const wadoRsViewportSchema = z.string().refine((v) => {
    const parts = v.split(",");
    if (parts.length === 2) {
        const [vw, vh] = parts.map(Number);
        return !Number.isNaN(vw) && !Number.isNaN(vh) && vw > 0 && vh > 0;
    }

    if (parts.length === 6) {
        let [vw, vh, sx, sy, sw, sh] = parts.map(Number);
        if (Number.isNaN(sw) || Number.isNaN(sh)) return false;

        if (Number.isNaN(sx)) {
            sx = 0;
        }
        if (Number.isNaN(sy)) {
            sy = 0;
        }

        return (
            [vw, vh, sx, sy, sw, sh].every((v) => !Number.isNaN(v)) &&
            vw > 0 &&
            vh > 0
        );
    }

    return false;
});

export const wadoRsQueryParamSchema = z.object({
    accept: z.string().optional(),
    charset: z.string().optional(),
    quality: z.coerce.number().int().min(1).max(100).optional(),
    window: z
        .string()
        .refine((v) => {
            const parts = v.split(",");
            if (parts.length !== 3) return false;

            const [center, width] = parts.slice(0, 2).map(Number);
            const fn = parts[2];

            return (
                !Number.isNaN(center) &&
                !Number.isNaN(width) &&
                ["linear", "linear-exact", "sigmoid"].includes(fn)
            );
        })
        .optional(),
    iccprofile: z
        .string()
        .default("no")
        .pipe(
            z.enum(["no", "yes", "srgb", "adobergb", "rommrgb", "displayp3"]),
        ),
    viewport: wadoRsViewportSchema.optional(),
    frameNumber: positiveNumberQuerySchema.optional(),
    password: z
        .string()
        .optional()
        .describe(
            "The password of the share link if the share link is protected",
        ),
});

const wadoRsBaseAcceptEnum = z.enum([
    "application/zip",
    'multipart/related; type="application/dicom"',
    'multipart/related; type="application/octet-stream"',
    'multipart/related; type="image/jpeg"',
    'multipart/related; type="image/jp2"',
    'multipart/related; type="image/png"',
    "*/*",
]);

export const wadoRsHeaderSchema = z.object({
    accept: wadoRsBaseAcceptEnum.default(
        'multipart/related; type="application/dicom"',
    ),
});

const wadoRsSingleFrameAcceptEnum = z.enum([
    "image/jpeg",
    "image/jp2",
    "image/png",
    "image/*",
    "*/*",
]);

const wadoRsMultipleFramesAcceptEnum = z.enum([
    'multipart/related; type="application/octet-stream"',
    'multipart/related; type="image/jpeg"',
    'multipart/related; type="image/jp2"',
    'multipart/related; type="image/png"',
    "*/*",
]);

const wadoRsRenderedFramesAcceptEnum = z.enum([
    ...wadoRsSingleFrameAcceptEnum.options,
    ...wadoRsMultipleFramesAcceptEnum.options,
]);

export const wadoRsRenderedFramesHeaderSchema = z.object({
    accept: wadoRsRenderedFramesAcceptEnum,
});

export const wadoRsSingleFrameHeaderSchema = z.object({
    accept: wadoRsSingleFrameAcceptEnum,
});

export const wadoRsMultipleFramesHeaderSchema = z.object({
    accept: wadoRsMultipleFramesAcceptEnum,
});
