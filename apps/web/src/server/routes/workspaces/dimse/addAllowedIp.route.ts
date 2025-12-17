import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { createAllowedIpSchema } from "@/server/schemas/dimseConfigSchema";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const addAllowedIpRoute = new Hono().post(
    "/workspaces/:workspaceId/dimse/allowed-ips",
    describeRoute({
        description: "Add allowed IP to DIMSE configuration",
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
    zValidator("json", createAllowedIpSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { ipMask, description } = c.req.valid("json");

        const dimseConfigService = new DimseConfigService();
        const allowedIp = await dimseConfigService.addAllowedIp({
            workspaceId,
            ipMask,
            description,
        });

        if (!allowedIp) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "DIMSE configuration not found",
                },
                404,
            );
        }

        return c.json(
            {
                ok: true,
                data: allowedIp,
                error: null,
            },
            201,
        );
    },
);

export default addAllowedIpRoute;
