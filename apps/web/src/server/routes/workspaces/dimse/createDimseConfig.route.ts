import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { createDimseConfigSchema } from "@/server/schemas/dimseConfigSchema";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const createDimseConfigRoute = new Hono().post(
    "/workspaces/:workspaceId/dimse",
    describeRoute({
        description: "Create DIMSE configuration for workspace",
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
    zValidator("json", createDimseConfigSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { aeTitle, enabled } = c.req.valid("json");

        const dimseConfigService = new DimseConfigService();

        const existingConfig =
            await dimseConfigService.getDimseConfig(workspaceId);
        if (existingConfig) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "DIMSE configuration already exists for this workspace",
                },
                409,
            );
        }

        const config = await dimseConfigService.createDimseConfig({
            workspaceId,
            aeTitle,
            enabled,
        });

        return c.json(
            {
                ok: true,
                data: config,
                error: null,
            },
            201,
        );
    },
);

export default createDimseConfigRoute;
