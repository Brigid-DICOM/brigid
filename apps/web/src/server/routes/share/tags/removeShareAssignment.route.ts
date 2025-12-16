import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifyShareLinkPermission } from "@/server/middlewares/shareLinkPermission.middleware";
import { TagService } from "@/server/services/tag.service";

const removeShareAssignmentRoute = new Hono().delete(
    "/:token/tag-assignments/:assignmentId",
    describeRoute({
        description: "Remove a tag assignment from a shared target",
        tags: ["Share Links - Tags"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            assignmentId: z.string().describe("The ID of the tag assignment"),
        }),
    ),
    zValidator(
        "query",
        z.object({
            password: z
                .string()
                .optional()
                .describe("The password for the share link"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifyShareLinkPermission(SHARE_PERMISSIONS.UPDATE),
    async (c) => {
        const workspaceId = c.get("workspaceId");
        const { assignmentId } = c.req.valid("param");

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

export default removeShareAssignmentRoute;
