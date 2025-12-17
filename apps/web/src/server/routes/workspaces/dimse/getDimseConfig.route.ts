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

const getDimseConfigRoute = new Hono().get(
    "/workspaces/:workspaceId/dimse",
    describeRoute({
        description: "Get DIMSE configuration for workspace",
        tags: ["DIMSE"],
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
        const { workspaceId } = c.req.valid("param");

        const dimseConfigService = new DimseConfigService();
        const config = await dimseConfigService.getDimseConfig(workspaceId);

        if (!config) {
            return c.json({
                ok: true,
                data: null,
                error: null,
            });
        }

        return c.json({
            ok: true,
            data: config,
            error: null,
        });
    },
);

export default getDimseConfigRoute;
