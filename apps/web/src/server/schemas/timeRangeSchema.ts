import { z } from "zod";

export const timeRangeSchema = z
    .string()
    .trim()
    // 驗證格式（case 1, case 2, case 3）
    .refine(
        (str) =>
            /^(\d{2,6}(?:\.\d{1,6})?)\s*-\s*(\d{2,6}(?:\.\d{1,6})?)$/.test(
                str,
            ) || // <time1>-<time2>
            /^-\s*(\d{2,6}(?:\.\d{1,6})?)$/.test(str) || // -<time1>
            /^(\d{2,6}(?:\.\d{1,6})?)\s*-$/.test(str) || // <time1>-
            /^\d{2,6}(?:\.\d{1,6})?$/.test(str), // <time>
        {
            message:
                "Invalid format. Expected '<time1>-<time2>', '-<time1>', '<time1>-', or <time>",
        },
    );

export type DicomTimeRangeMatchType = z.infer<typeof timeRangeSchema>;
