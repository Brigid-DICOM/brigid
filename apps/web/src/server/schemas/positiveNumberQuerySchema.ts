import { z } from "zod";

export const positiveNumberQuerySchema = z.string().trim().refine(
    (str) => 
        str.split(",").every(num => Number(num) > 0) &&
        str.split(",").every(num => Number.isInteger(Number(num))),
    {
        message: "Invalid format. Expected '<number1>,<number2>,...', or <positive number>",
    }
);