import { z } from "zod";

export const dateRangeSchema = z
    .string()
    .trim()
    .refine(
        (value) => {
            if (!value) return true;

            return (
                /^(\d{8})\s*-\s*(\d{8})$/.test(value) || // case 1
                /^-\s*(\d{8})$/.test(value) || // case 2
                /^(\d{8})\s*-$/.test(value) || // case 3
                /^\d{8}$/.test(value)
            ); // case 4
        },
        {
            message:
                "Invalid format. Expected '<date1>-<date2>', '-<date1>', '<date1>-', or <date>",
        },
    );

export type DicomDateRangeMatchType = z.infer<typeof dateRangeSchema>;
