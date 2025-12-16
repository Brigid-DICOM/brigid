import { TAG_TARGET_TYPE } from "@brigid/database/src/entities/tagAssignment.entity";
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
    zValidator(
        "query",
        z.object({
            name: z.string().optional().describe("The name of the tag"),
            targetType: z
                .enum([
                    TAG_TARGET_TYPE.STUDY,
                    TAG_TARGET_TYPE.SERIES,
                    TAG_TARGET_TYPE.INSTANCE,
                ])
                .optional()
                .describe("The type of target"),
        }),
    ),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { name, targetType } = c.req.valid("query");

        const tagService = new TagService();
        const tags = await tagService.getWorkspaceTags(
            workspaceId,
            name,
            targetType,
        );

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
