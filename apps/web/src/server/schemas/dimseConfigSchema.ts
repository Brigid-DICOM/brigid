import { z } from "zod";

const aeTitleSchema = z
    .string()
    .min(1)
    .max(16)
    .regex(
        /^[A-Z0-9_ ]+$/,
        "AE Title must be uppercase alphanumeric, underscore or space",
    );

// IP 掩碼格式：支援 CIDR 格式如 192.168.1.0/24 或單一 IP
const ipMaskSchema = z
    .string()
    .regex(/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/, "Invalid IP mask format");

// 精確 IP 格式
const ipAddressSchema = z
    .string()
    .regex(/^(\d{1,3}\.){3}\d{1,3}$/, "Invalid IP address format");

export const createDimseConfigSchema = z.object({
    aeTitle: aeTitleSchema,
    enabled: z.boolean().optional().default(false),
});

export const updateDimseConfigSchema = z.object({
    aeTitle: aeTitleSchema.optional(),
    enabled: z.boolean().optional(),
});

export const createAllowedIpSchema = z.object({
    ipMask: ipMaskSchema,
    description: z.string().max(500).optional(),
});

export const createAllowedRemoteSchema = z.object({
    aeTitle: aeTitleSchema,
    host: ipAddressSchema,
    port: z.number().int().min(1).max(65535),
    description: z.string().max(500).optional(),
});

export const updateAllowedRemoteSchema = z.object({
    aeTitle: aeTitleSchema.optional(),
    host: ipAddressSchema.optional(),
    port: z.number().int().min(1).max(65535).optional(),
    description: z.string().max(500).optional(),
});

export type CreateDimseConfigPayload = z.infer<typeof createDimseConfigSchema>;
export type UpdateDimseConfigPayload = z.infer<typeof updateDimseConfigSchema>;
export type CreateAllowedIpPayload = z.infer<typeof createAllowedIpSchema>;
export type CreateAllowedRemotePayload = z.infer<
    typeof createAllowedRemoteSchema
>;
export type UpdateAllowedRemotePayload = z.infer<
    typeof updateAllowedRemoteSchema
>;
