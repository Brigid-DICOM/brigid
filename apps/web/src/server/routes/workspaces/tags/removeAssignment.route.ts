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

const removeAssignmentRoute = new Hono().delete(
    "/workspaces/:workspaceId/tag-assignments/:assignmentId",
    describeRoute({
        description: "Remove a tag assignment",
        tags: ["Tags"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.UPDATE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            assignmentId: z.string().describe("The ID of the tag assignment"),
        }),
    ),
    async (c) => {
        const { workspaceId, assignmentId } = c.req.valid("param");

        const tagService = new TagService();
        const removedAssignment = await tagService.removeTagAssignment({
            workspaceId,
            assignmentId,
        });

        if (!removedAssignment) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: {
                        message: "Tag assignment not found",
                    },
                },
                404,
            );
        }

        return c.json(
            {
                ok: true,
                data: null,
                error: null,
            },
            200,
        );
    },
);

export default removeAssignmentRoute;
