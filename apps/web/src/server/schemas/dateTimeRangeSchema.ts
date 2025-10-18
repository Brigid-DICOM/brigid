import { z } from "zod";

export const dateTimeRangeSchema = z
    .string()
    .trim()
    // 驗證格式（case 1, case 2, case 3）
    .refine(
        (str) =>
            /^(\d{4}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\.\d{1,6})?)?)?)?)?)?(?:[+-]\d{4})?)\s*-\s*(\d{4}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\.\d{1,6})?)?)?)?)?)?(?:[+-]\d{4})?)$/.test(
                str,
            ) || // <datetime1>-<datetime2>
            /^-\s*(\d{4}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\.\d{1,6})?)?)?)?)?)?(?:[+-]\d{4})?)$/.test(
                str,
            ) || // -<datetime1>
            /^(\d{4}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\.\d{1,6})?)?)?)?)?)?(?:[+-]\d{4})?)\s*-$/.test(
                str,
            ) || // <datetime1>-
            /^\d{4}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\d{2}(?:\.\d{1,6})?)?)?)?)?(?:[+-]\d{4})?)$/.test(
                str,
            ), // <datetime>
        {
            message:
                "Invalid format. Expected '<datetime1>-<datetime2>', '-<datetime1>', '<datetime1>-', or <datetime>",
        },
    );

export type DicomDateTimeRangeMatchType = z.infer<typeof dateTimeRangeSchema>;
