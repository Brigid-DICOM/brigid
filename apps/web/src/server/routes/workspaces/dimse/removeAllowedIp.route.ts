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

const removeAllowedIpRoute = new Hono().delete(
    "/workspaces/:workspaceId/dimse/allowed-ips/:allowedIpId",
    describeRoute({
        description: "Remove allowed IP from DIMSE configuration",
        tags: ["DIMSE"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            allowedIpId: z.string().uuid().describe("The ID of the allowed IP"),
        }),
    ),
    async (c) => {
        const { workspaceId, allowedIpId } = c.req.valid("param");

        const dimseConfigService = new DimseConfigService();
        const removedIp = await dimseConfigService.removeAllowedIp({
            workspaceId,
            allowedIpId,
        });

        if (!removedIp) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Allowed IP not found",
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

export default removeAllowedIpRoute;
