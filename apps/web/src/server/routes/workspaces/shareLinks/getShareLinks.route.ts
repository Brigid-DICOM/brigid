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
    module: "GetShareLinksRoute",
});

const getShareLinksRoute = new Hono().get(
    "/workspaces/:workspaceId/share-links",
    describeRoute({
        description: "Get all share links of a workspace",
        tags: ["Share Links"],
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
    async (c) => {
        try {
            const { workspaceId } = c.req.valid("param");
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
            const shareLinks = await shareLinkService.getUserShareLinks({
                userId,
                workspaceId,
            });

            return c.json(
                {
                    ok: true,
                    data: shareLinks,
                    error: null,
                },
                200,
            );
        } catch (error) {
            logger.error("Get share links failed", error);

            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Get share links failed",
                },
                500,
            );
        }
    },
);

export default getShareLinksRoute;
