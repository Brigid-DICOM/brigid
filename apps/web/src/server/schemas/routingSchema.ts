import { z } from "zod";

const routingConditionSchema = z.object({
    tag: z.string().min(1),
    operator: z.enum(["equals", "notEquals", "contains", "in"]),
    value: z.union([z.string(), z.array(z.string())]),
});

export const createDestinationSchema = z
    .object({
        name: z.string().min(1).max(255),
        type: z.enum(["dimse", "dicomweb"]),
        enabled: z.boolean().optional(),
        aeTitle: z.string().max(16).optional().nullable(),
        host: z.string().max(255).optional().nullable(),
        port: z.number().int().min(1).max(65535).optional().nullable(),
        baseUrl: z.string().url().optional().nullable(),
        authType: z.enum(["none", "basic", "bearer"]).optional().nullable(),
        authUsername: z.string().max(255).optional().nullable(),
        authSecret: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
    })
    .superRefine((data, ctx) => {
        if (data.type === "dimse") {
            if (!data.aeTitle || !data.host || !data.port) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "DIMSE destination requires aeTitle, host, and port",
                });
            }
        }
        if (data.type === "dicomweb" && !data.baseUrl) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "DICOMweb destination requires baseUrl",
            });
        }
    });

export const updateDestinationSchema = createDestinationSchema.partial().extend({
    type: z.enum(["dimse", "dicomweb"]).optional(),
});

export const createRuleSchema = z.object({
    name: z.string().min(1).max(255),
    enabled: z.boolean().optional(),
    priority: z.number().int().optional(),
    destinationId: z.string().uuid(),
    delaySeconds: z.number().int().min(0).optional(),
    conditions: z.array(routingConditionSchema).min(1),
});

export const updateRuleSchema = createRuleSchema.partial();

export const createRoutingTagSchema = z.object({
    tagKey: z.string().min(1).max(255),
    label: z.string().max(255).optional().nullable(),
});

export const listJobsQuerySchema = z.object({
    status: z
        .enum([
            "queued",
            "scheduled",
            "sending",
            "succeeded",
            "failed",
            "dead",
        ])
        .optional(),
    destinationId: z.string().uuid().optional(),
    ruleId: z.string().uuid().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    limit: z.coerce.number().int().min(1).max(200).optional(),
    offset: z.coerce.number().int().min(0).optional(),
});
