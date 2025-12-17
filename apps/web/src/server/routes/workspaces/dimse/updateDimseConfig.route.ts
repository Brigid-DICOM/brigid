import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { updateDimseConfigSchema } from "@/server/schemas/dimseConfigSchema";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const updateDimseConfigRoute = new Hono().patch(
    "/workspaces/:workspaceId/dimse",
    describeRoute({
        description: "Update DIMSE configuration for workspace",
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
    zValidator("json", updateDimseConfigSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { aeTitle, enabled } = c.req.valid("json");

        const dimseConfigService = new DimseConfigService();
        const config = await dimseConfigService.updateDimseConfig({
            workspaceId,
            aeTitle,
            enabled,
        });

        if (!config) {
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
            data: config,
            error: null,
        });
    },
);

export default updateDimseConfigRoute;
