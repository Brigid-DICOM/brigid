import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "DeleteShareLinkRoute",
});

const deleteShareLinkRoute = new Hono().delete(
    "/workspaces/:workspaceId/share-links/:shareLinkId",
    describeRoute({
        description: "Delete a share link",
        tags: ["Share Links"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            shareLinkId: z.string().describe("The ID of the share link"),
        }),
    ),
    async (c) => {
        try {
            const { workspaceId, shareLinkId } = c.req.valid("param");
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            if (!userId) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Unauthorized",
                    },
                    401,
                );
            }

            const shareLinkService = new ShareLinkService();
            const deletedShareLink = await shareLinkService.deleteShareLink({
                shareLinkId,
                workspaceId,
                creatorId: userId,
            });

            if (!deletedShareLink) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Share link not found",
                    },
                    404,
                );
            }

            return c.json(
                {
                    ok: true,
                    data: {
                        id: shareLinkId,
                        deleted: true,
                    },
                    error: null,
                },
                200,
            );
        } catch (error) {
            logger.error("Delete share link failed", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Delete share link failed",
                },
                500,
            );
        }
    },
);

export default deleteShareLinkRoute;
