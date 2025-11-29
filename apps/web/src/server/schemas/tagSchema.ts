import { z } from "zod";

const hexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const createTagSchema = z.object({
    name: z.string().min(1).max(255),
    color: hexColorSchema
});

export const updateTagSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    color: hexColorSchema.optional(),
});

export const assignTagSchema = z.object({
    tagId: z.uuid(),
    targetType: z.enum(["study", "series", "instance"]),
    targetId: z.string().min(1),
});

export const removeTagAssignmentSchema = z.object({
    assignmentId: z.uuid()
});

export const shareAssignTagSchema = z.object({
    tags: z.array(
        z.object({
            name: z.string().min(1).max(255),
            color: hexColorSchema,
        })
    ).min(1).describe("Tags to create/update and assign"),
    targets: z.array(
        z.object({
            targetType: z.enum(["study", "series", "instance"]),
            targetId: z.string().min(1),
        })
    ).min(1).describe("Targets to assign tags to"),
    password: z.string().optional().describe("The password for the share link"),
});

export type CreateTagPayload = z.infer<typeof createTagSchema>;
export type UpdateTagPayload = z.infer<typeof updateTagSchema>;
export type AssignTagPayload = z.infer<typeof assignTagSchema>;
export type RemoveTagAssignmentPayload = z.infer<typeof removeTagAssignmentSchema>;