import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { TagService } from "@/server/services/tag.service";

const getAllTagsRoute = new Hono().get(
    "/workspaces/:workspaceId/tags",
    describeRoute({
        description: "Get all tags for a workspace",
        tags: ["Tags"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("query", z.object({
        name: z.string().optional().describe("The name of the tag"),
    })),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { name } = c.req.valid("query");

        const tagService = new TagService();
        const tags = await tagService.getWorkspaceTags(workspaceId, name);

        return c.json(
            {
                ok: true,
                data: tags,
                error: null,
            },
            200,
        );
    },
);

export default getAllTagsRoute;
