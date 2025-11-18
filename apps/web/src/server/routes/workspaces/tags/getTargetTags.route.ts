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

const getTargetTagsRoute = new Hono().get(
    "/workspaces/:workspaceId/tags/:targetType/:targetId",
    describeRoute({
        description: "Get tags for a target (study, series, instance)",
        tags: ["Tags"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            targetType: z
                .enum(["study", "series", "instance"])
                .describe("The type of target"),
            targetId: z.string().describe("The ID of the target"),
        }),
    ),
    async (c) => {
        const { workspaceId, targetType, targetId } = c.req.valid("param");

        const tagService = new TagService();
        const tags = await tagService.getTargetTags({
            workspaceId,
            targetType,
            targetId,
        });

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

export default getTargetTagsRoute;
