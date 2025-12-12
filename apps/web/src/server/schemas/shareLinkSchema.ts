import z from "zod";
import { SHARE_PERMISSIONS } from "../const/share.const";

export const createShareLinkSchema = z.object({
    targetType: z
        .enum(["study", "series", "instance"])
        .describe("The type of the target"),
    targetIds: z.array(z.string()).describe("The IDs of the targets"),
    name: z
        .string()
        .max(255)
        .optional()
        .describe("The name of the share link"),
    publicPermissions: z
        .number()
        .min(0)
        .max(SHARE_PERMISSIONS.FULL)
        .default(0)
        .describe("The public permissions"),
    requiredPassword: z
        .boolean()
        .default(false)
        .describe("Whether the share link requires a password"),
    password: z
        .string()
        .max(255)
        .optional()
        .describe("The password for the share link"),
    expiresInSec: z
        .number()
        .optional()
        .describe("The number of seconds until the share link expires"),
    description: z
        .string()
        .optional()
        .describe("The description of the share link"),
    recipients: z
        .array(
            z.object({
                userId: z.string().describe("The ID of the user"),
                permissions: z
                    .number()
                    .min(0)
                    .max(SHARE_PERMISSIONS.FULL)
                    .describe("The permissions for the user"),
            }),
        )
        .optional()
        .describe("The recipients of the share link"),
});

export const updateShareLinkSchema = z.object({
    name: z
        .string()
        .max(255)
        .optional()
        .describe("The name of the share link"),
    expiresInSec: z
        .number()
        .optional()
        .describe("The number of seconds until the share link expires"),
    password: z
        .string()
        .max(255)
        .optional()
        .describe("The password for the share link"),
    requiredPassword: z
        .boolean()
        .optional()
        .describe("Whether the share link requires a password"),
    publicPermissions: z
        .number()
        .min(0)
        .max(SHARE_PERMISSIONS.FULL)
        .optional()
        .describe("The public permissions"),
    description: z
        .string()
        .optional()
        .describe("The description of the share link"),
    recipients: z
        .array(
            z.object({
                userId: z.string().describe("The ID of the user"),
                permissions: z
                    .number()
                    .min(0)
                    .max(SHARE_PERMISSIONS.FULL)
                    .describe("The permissions for the user"),
            }),
        )
        .optional()
        .describe("The recipients of the share link"),
});


export const verifyPasswordSchema = z.object({
    password: z.string().max(255).describe("The password for the share link"),
});