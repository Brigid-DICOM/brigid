import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const removeAllowedRemoteRoute = new Hono().delete(
    "/workspaces/:workspaceId/dimse/allowed-remotes/:remoteId",
    describeRoute({
        description: "Remove allowed remote AE from DIMSE configuration",
        tags: ["DIMSE"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            remoteId: z.string().uuid().describe("The ID of the remote AE"),
        }),
    ),
    async (c) => {
        const { workspaceId, remoteId } = c.req.valid("param");

        const dimseConfigService = new DimseConfigService();
        const removedRemote = await dimseConfigService.removeAllowedRemote({
            workspaceId,
            remoteId,
        });

        if (!removedRemote) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Remote AE not found",
                },
                404,
            );
        }

        return c.json({
            ok: true,
            data: null,
            error: null,
        });
    },
);

export default removeAllowedRemoteRoute;
