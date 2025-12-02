import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { updateShareLinkSchema } from "@/server/schemas/shareLinkSchema";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "UpdateShareLinkRoute",
});

const updateShareLinkRoute = new Hono().patch(
    "/workspaces/:workspaceId/share-links/:shareLinkId",
    describeRoute({
        description: "Update a share link",
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
    zValidator("json", updateShareLinkSchema),
    async (c) => {
        try {
            const { shareLinkId } = c.req.valid("param");
            const payload = c.req.valid("json");
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            // 正常來說 userId 不會是 null，因為 verifyAuthMiddleware 內已經驗證以及設定 user
            // 但為了下方的 type safety，還是進行驗證
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
            const updatedShareLink = await shareLinkService.updateShareLink({
                shareLinkId,
                creatorId: userId,
                name: payload.name,
                publicPermissions: payload.publicPermissions,
                requiredPassword: payload.requiredPassword,
                password: payload.password,
                expiresInSec: payload.expiresInSec,
                recipientPermissions: payload.recipients,
            });

            if (!updatedShareLink) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Share link not found",
                    },
                    404,
                );
            }

            return c.json({
                ok: true,
                data: {
                    id: updatedShareLink.id,
                    updatedAt: updatedShareLink.updatedAt,
                },
                error: null,
            });
        } catch (error) {
            logger.error("Update share link failed", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Update share link failed",
                },
                500,
            );
        }
    },
);

export default updateShareLinkRoute;
