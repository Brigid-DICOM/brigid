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

const deleteTagRoute = new Hono().delete(
    "/workspaces/:workspaceId/tags/:tagId",
    describeRoute({
        description: "Delete a tag",
        tags: ["Tags"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.UPDATE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            tagId: z.string().describe("The ID of the tag"),
        }),
    ),
    async (c) => {
        const { workspaceId, tagId } = c.req.valid("param");

        const tagService = new TagService();
        const deletedTag = await tagService.deleteTag({
            workspaceId,
            tagId,
        });

        if (!deletedTag) {
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
                data: null,
                error: null,
            },
            200,
        );
    },
);

export default deleteTagRoute;
