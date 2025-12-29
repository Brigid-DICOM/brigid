import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { getEventLogQuerySchema } from "@/server/schemas/eventLogSchema";
import { EventLogService } from "@/server/services/eventLog.service";

const getEventLogsRoute = new Hono().get(
    "/workspaces/:workspaceId/event-logs",
    describeRoute({
        description: "Get event logs",
        tags: ["Event Logs"],
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
    zValidator("query", getEventLogQuerySchema),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const eventLogService = new EventLogService();

        const { items, hasNextPage } = await eventLogService.getLogs(
            workspaceId,
            c.req.valid("query"),
        );

        return c.json(
            {
                ok: true,
                data: {
                    eventLogs: items,
                    hasNextPage,
                },
                error: null,
            },
            200,
        );
    },
);

export default getEventLogsRoute;
