import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { updateAllowedRemoteSchema } from "@/server/schemas/dimseConfigSchema";
import { DimseConfigService } from "@/server/services/dimseConfig.service";

const updateAllowedRemoteRoute = new Hono().patch(
    "/workspaces/:workspaceId/dimse/allowed-remotes/:remoteId",
    describeRoute({
        description: "Update allowed remote AE in DIMSE configuration",
        tags: ["DIMSE"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            remoteId: z.uuid().describe("The ID of the remote AE"),
        }),
    ),
    zValidator("json", updateAllowedRemoteSchema),
    async (c) => {
        const { workspaceId, remoteId } = c.req.valid("param");
        const { aeTitle, host, port, description } = c.req.valid("json");

        const dimseConfigService = new DimseConfigService();
        const remote = await dimseConfigService.updateAllowedRemote({
            workspaceId,
            remoteId,
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
                    error: "Remote AE not found",
                },
                404,
            );
        }

        return c.json({
            ok: true,
            data: remote,
            error: null,
        });
    },
);

export default updateAllowedRemoteRoute;
