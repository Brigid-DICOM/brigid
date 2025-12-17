import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { createAllowedRemoteSchema } from "@/server/schemas/dimseConfigSchema";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const addAllowedRemoteRoute = new Hono().post(
    "/workspaces/:workspaceId/dimse/allowed-remotes",
    describeRoute({
        description: "Add allowed remote AE to DIMSE configuration",
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
    zValidator("json", createAllowedRemoteSchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { aeTitle, host, port, description } = c.req.valid("json");

        const dimseConfigService = new DimseConfigService();
        const remote = await dimseConfigService.addAllowedRemote({
            workspaceId,
            aeTitle,
            host,
            port,
            description,
        });

        if (!remote) {
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
                data: remote,
                error: null,
            },
            201,
        );
    },
);

export default addAllowedRemoteRoute;
