import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { createTagSchema } from "@/server/schemas/tagSchema";
import { TagService } from "@/server/services/tag.service";

const createTagRoute = new Hono().post(
    "/workspaces/:workspaceId/tags",
    describeRoute({
        description: "Create a new tag",
        tags: ["Tags"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.CREATE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("json", createTagSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { name, color } = c.req.valid("json");

        const tagService = new TagService();
        const tag = await tagService.createTag({
            workspaceId,
            name,
            color,
        });

        return c.json({
            ok: true,
            data: tag,
            error: null,
        });
    },
);

export default createTagRoute;
