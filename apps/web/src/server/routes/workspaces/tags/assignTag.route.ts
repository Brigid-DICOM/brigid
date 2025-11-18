import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { assignTagSchema } from "@/server/schemas/tagSchema";
import { TagService } from "@/server/services/tag.service";

const assignTagRoute = new Hono().post(
    "/workspaces/:workspaceId/tags/assign",
    describeRoute({
        description: "Assign a tag to a target (study, series, instance)",
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
    zValidator("json", assignTagSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { tagId, targetType, targetId } = c.req.valid("json");

        const tagService = new TagService();
        const assignment = await tagService.assignTag({
            workspaceId,
            tagId,
            targetType: targetType as TagTargetType,
            targetId,
        });

        if (!assignment) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: {
                        message: "Tag not found",
                    },
                },
                404,
            );
        }

        return c.json(
            {
                ok: true,
                data: assignment,
                error: null,
            },
            201,
        );
    },
);

export default assignTagRoute;
