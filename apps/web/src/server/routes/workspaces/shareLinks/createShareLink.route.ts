import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { createShareLinkSchema } from "@/server/schemas/shareLinkSchema";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "CreateShareLinkRoute",
});

const createShareLinkRoute = new Hono().post(
    `/workspaces/:workspaceId/share-links`,
    describeRoute({
        description: "Create a new share link",
        tags: ["Share Links"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("json", createShareLinkSchema),
    async (c) => {
        try {
            const { workspaceId } = c.req.valid("param");
            const payload = c.req.valid("json");
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
            const shareLink = await shareLinkService.createShareLink({
                creatorId: userId,
                workspaceId,
                targetType: payload.targetType,
                targetIds: payload.targetIds,
                name: payload.name,
                publicPermissions: payload.publicPermissions,
                requiredPassword: payload.requiredPassword,
                password: payload.password,
                expiresInSec: payload.expiresInSec,
                description: payload.description,
                recipients: payload.recipients,
            });

            return c.json(
                {
                    ok: true,
                    data: {
                        id: shareLink.id,
                        token: shareLink.token,
                        createdAt: shareLink.createdAt,
                    },
                    error: null,
                },
                201,
            );
        } catch (error) {
            logger.error("Create share link failed", error);

            if (error instanceof HTTPException) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: error.message,
                    },
                    error.status,
                );
            }

            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Create share link failed",
                },
                500,
            );
        }
    },
);

export default createShareLinkRoute;
