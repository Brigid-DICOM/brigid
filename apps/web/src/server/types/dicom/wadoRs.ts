import { z } from "zod";

export const wadoRsQueryParamSchema = z.object({
    accept: z.string().optional(),
    charset: z.string().optional(),
    quality: z.coerce.number().int().min(1).max(100).optional(),
    window: z.string().refine((v) => {
        const parts = v.split(",");
        if (parts.length !== 3) return false;

        const [center, width] = parts.slice(0, 2).map(Number);
        const fn = parts[2];

        return !Number.isNaN(center) && !Number.isNaN(width) && ["linear", "linear-exact", "sigmoid"].includes(fn);
    }).optional(),
    iccprofile: z.string().default("no").pipe(z.enum(["no", "yes", "srgb", "adobergb", "rommrgb"])),
    viewport: z.string().refine((v) => {
        const parts = v.split(",");
        if (parts.length === 2) {
            const [vw, vh] = parts.map(Number);
            return Number.isNaN(vw) && Number.isNaN(vh) && vw > 0 && vh > 0;
        }

        if (parts.length === 6) {
            const [vw, vh, sx, sy, sw, sh] = parts.map(Number);
            if (Number.isNaN(sx) || Number.isNaN(sy)) return false;

            return (
                [vw, vh, sx, sy, sw, sh].every(v => !Number.isNaN(v)) &&
                vw > 0 &&
                vh > 0 &&
                sw > 0 &&
                sh > 0
            );
        }

        return false;
    }).optional()
})