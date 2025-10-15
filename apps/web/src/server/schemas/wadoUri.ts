import { z } from "zod";

export const wadoUriQueryParamSchema = z.object({
    requestType: z
        .literal("WADO")
        .describe("The type of request, must be WADO"),
    studyUID: z
        .string()
        .describe("The value of this parameter is a Study Instance UID"),
    seriesUID: z
        .string()
        .describe("The value of this parameter is a Series Instance UID"),
    objectUID: z
        .string()
        .describe("The value of this parameter is a SOP Instance UID"),
    contentType: z
        .string()
        .optional()
        .default("application/dicom")
        .pipe(
            z.enum([
                "application/dicom",
                "image/jpeg",
                "image/jp2",
                "image/png",
            ]),
        )
        .describe(
            "The Accept Query Parameter specifies the Acceptable Media Types for the response payload",
        ),
    charset: z.string().optional(),
    row: z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .describe(
            `This parameter specifies the number of pixel rows in the returned image. It corresponds to the height in pixels of the user agent's viewport. Its name is "rows" and its value shall be a positive integer.`,
        ),
    column: z.coerce
        .number()
        .int()
        .min(1)
        .optional()
        .describe(
            `This parameter specifies the number of pixel columns in the returned image. It corresponds to the width, in pixels, of the user agent's viewport. Its name is "columns" and its value shall be a positive integer.`,
        ),
    region: z
        .string()
        .refine((v) => {
            const parts = v.split(",");
            if (parts.length !== 4) return false;
            const nums = parts.map(Number);
            if (nums.some(Number.isNaN)) return false;

            const [xmin, ymin, xmax, ymax] = nums;
            const validRange =
                xmin >= 0 &&
                ymin >= 0 &&
                xmax <= 1 &&
                ymax <= 1 &&
                xmin < xmax &&
                ymin < ymax;

            return validRange;
        })
        .optional()
        .describe(
            `
        This parameter specifies a rectangular region of the Target Resource. Its name is "region" and its values shall be a comma-separated list of four positive decimal numbers:
        xmin
        the left column of the region

        ymin
        the top row of the region

        xmax
        the right column of the region

        ymax
        the bottom row of the region

        The region is specified using a normalized coordinate system relative to the size of the original image matrix, measured in rows and columns. Where

        0.0, 0.0 corresponds to the top row and left column of the image

        1.0, 1.0 corresponds to the bottom row and right column of the image

        and

        0.0 <= xmin < xmax <= 1.0

        0.0 <= ymin < ymax <= 1.0

        This parameter when used in conjunction with one of the viewport parameters, allows the user agent to map a selected area of the source image into its viewport.
        `,
        ),
    windowCenter: z.coerce
        .number()
        .optional()
        .describe(
            "This parameter specifies the Window Center of the returned image",
        ),
    windowWidth: z.coerce
        .number()
        .optional()
        .describe("This parameter specifies the Window Width"),
    imageQuality: z.coerce
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .describe(
            `The "quality" parameter specifies the requested quality of the rendered images`,
        ),
    frameNumber: z.coerce
        .number()
        .int()
        .min(1)
        .default(1)
        .optional()
        .describe(
            "This parameter specifies a single Frame within a Multi-frame Image Instance",
        ),
}).superRefine((input, ctx) => {
    const windowCenterAbsent = input.windowCenter === undefined;
    const windowWidthAbsent = input.windowWidth === undefined;

    if (windowCenterAbsent && !windowWidthAbsent) {
        ctx.addIssue({
            code: "custom",
            path: ["windowCenter"],
            message: "windowCenter is required when windowWidth is provided",
        })
    }

    if (!windowCenterAbsent && windowWidthAbsent) {
        ctx.addIssue({
            code: "custom",
            path: ["windowWidth"],
            message: "windowWidth is required when windowCenter is provided",
        })
    }
})
