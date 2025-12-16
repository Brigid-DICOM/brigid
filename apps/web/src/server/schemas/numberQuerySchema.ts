import { z } from "zod";

export const numberQuerySchema = z
    .string()
    .trim()
    .refine((str) => /^-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?)*$/.test(str), {
        message:
            "Invalid format. Expected '<number1>,<number2>,...', '-<number1>', or <number>",
    });
