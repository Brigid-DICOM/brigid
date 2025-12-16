import { z } from "zod";

export const deleteInstancesBodySchema = z.object({
    instanceIds: z.array(z.string().min(1)).min(1),
});

export const deleteSeriesBodySchema = z.object({
    seriesIds: z.array(z.string().min(1)).min(1),
});

export const deleteStudiesBodySchema = z.object({
    studyIds: z.array(z.string().min(1)).min(1),
});

export const restoreInstancesBodySchema = z.object({
    instanceIds: z.array(z.string().min(1)).min(1),
});

export const restoreSeriesBodySchema = z.object({
    seriesIds: z.array(z.string().min(1)).min(1),
});

export const restoreStudyBodySchema = z.object({
    studyIds: z.array(z.string().min(1)).min(1),
});
