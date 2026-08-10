import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { RoutingJobQueryService } from "@/server/routing/jobQueryService";
import { listJobsQuerySchema } from "@/server/schemas/routingSchema";

const workspaceParam = z.object({
    workspaceId: z.string(),
});

const jobsRoute = new Hono()
    .get(
        "/workspaces/:workspaceId/routing/jobs",
        describeRoute({
            description: "List routing jobs",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("param", workspaceParam),
        zValidator("query", listJobsQuerySchema),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const query = c.req.valid("query");
            const result = await new RoutingJobQueryService().list(
                workspaceId,
                query,
            );
            return c.json({ ok: true, data: result, error: null });
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/jobs/:id/send-now",
        describeRoute({
            description: "Send routing job now",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.UPDATE),
        zValidator(
            "param",
            workspaceParam.extend({ id: z.string().uuid() }),
        ),
        async (c) => {
            const { workspaceId, id } = c.req.valid("param");
            try {
                const job = await new RoutingJobQueryService().sendNow(
                    workspaceId,
                    id,
                );
                return c.json({ ok: true, data: job, error: null });
            } catch (error) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                    400,
                );
            }
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/jobs/:id/retry",
        describeRoute({
            description: "Retry failed routing job",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.UPDATE),
        zValidator(
            "param",
            workspaceParam.extend({ id: z.string().uuid() }),
        ),
        async (c) => {
            const { workspaceId, id } = c.req.valid("param");
            try {
                const job = await new RoutingJobQueryService().retry(
                    workspaceId,
                    id,
                );
                return c.json({ ok: true, data: job, error: null });
            } catch (error) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    },
                    400,
                );
            }
        },
    );

export default jobsRoute;
