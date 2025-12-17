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

const deleteDimseConfigRoute = new Hono().delete(
    "/workspaces/:workspaceId/dimse",
    describeRoute({
        description: "Delete DIMSE configuration for workspace",
        tags: ["DIMSE"],
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
    async (c) => {
        const { workspaceId } = c.req.valid("param");

        const dimseConfigService = new DimseConfigService();
        const deletedConfig =
            await dimseConfigService.deleteDimseConfig(workspaceId);

        if (!deletedConfig) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "DIMSE configuration not found",
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

export default deleteDimseConfigRoute;
