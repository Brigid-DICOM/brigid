import { z } from "zod";

export const getEventLogQuerySchema = z.object({
    name: z.string().optional(),
    level: z.string().optional(),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),
    limit: z.coerce.number().min(1).max(100).default(10),
    offset: z.coerce.number().min(0).default(0),
});

export type GetEventLogQuery = z.infer<typeof getEventLogQuerySchema>;
