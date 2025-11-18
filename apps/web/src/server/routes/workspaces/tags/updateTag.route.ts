import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { updateTagSchema } from "@/server/schemas/tagSchema";
import { TagService } from "@/server/services/tag.service";

const updateTagRoute = new Hono().patch(
    "/workspaces/:workspaceId/tags/:tagId",
    describeRoute({
        description: "Update a tag",
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
    zValidator("json", updateTagSchema),
    async (c) => {
        const { workspaceId, tagId } = c.req.valid("param");
        const { name, color } = c.req.valid("json");

        const tagService = new TagService();
        const tag = await tagService.updateTag({
            workspaceId,
            tagId,
            name,
            color,
        });

        if (!tag) {
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
                data: tag,
                error: null,
            },
            200,
        );
    },
);

export default updateTagRoute;
