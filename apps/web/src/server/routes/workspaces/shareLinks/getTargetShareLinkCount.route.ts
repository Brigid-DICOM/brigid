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
    module: "GetTargetShareLinkCountRoute",
});

const getTargetShareLinkCountRoute = new Hono().get(
    "/workspaces/:workspaceId/share-links/:targetType/count",
    describeRoute({
        description:
            "Get the count of share links for a target (study, series, instance)",
        tags: ["Share Links"],
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
        }),
    ),
    zValidator(
        "query",
        z.object({
            targetIds: z.preprocess((val) => {
                if (typeof val === "string") {
                    return [val];
                }
                return val;
            }, z.array(z.string()).describe("The IDs of the targets")),
        }),
    ),
    async (c) => {
        try {
            const { workspaceId, targetType } = c.req.valid("param");
            const { targetIds } = c.req.valid("query");
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
            const count = await shareLinkService.getTargetShareLinkCount({
                targetType,
                targetIds,
                workspaceId,
                userId,
            });

            return c.json(
                {
                    ok: true,
                    data: {
                        count,
                    },
                    error: null,
                },
                200,
            );
        } catch (error) {
            logger.error("Get target share link count failed", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Get target share link count failed",
                },
                500,
            );
        }
    },
);

export default getTargetShareLinkCountRoute;
