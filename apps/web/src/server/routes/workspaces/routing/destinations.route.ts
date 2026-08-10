import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { RoutingDestinationService } from "@/server/routing/destinationService";
import {
    createDestinationSchema,
    updateDestinationSchema,
} from "@/server/schemas/routingSchema";

const workspaceParam = z.object({
    workspaceId: z.string(),
});

const destinationsRoute = new Hono()
    .get(
        "/workspaces/:workspaceId/routing/destinations",
        describeRoute({
            description: "List routing destinations",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("param", workspaceParam),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const destinations = await new RoutingDestinationService().list(
                workspaceId,
            );
            return c.json({ ok: true, data: { destinations }, error: null });
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/destinations",
        describeRoute({
            description: "Create routing destination",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator("param", workspaceParam),
        zValidator("json", createDestinationSchema),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const body = c.req.valid("json");
            try {
                const destination = await new RoutingDestinationService().create(
                    {
                        workspaceId,
                        ...body,
                    },
                );
                return c.json(
                    { ok: true, data: destination, error: null },
                    201,
                );
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
    .patch(
        "/workspaces/:workspaceId/routing/destinations/:id",
        describeRoute({
            description: "Update routing destination",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator(
            "param",
            workspaceParam.extend({ id: z.string().uuid() }),
        ),
        zValidator("json", updateDestinationSchema),
        async (c) => {
            const { workspaceId, id } = c.req.valid("param");
            const body = c.req.valid("json");
            const destination = await new RoutingDestinationService().update({
                workspaceId,
                id,
                ...body,
            });
            if (!destination) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Routing destination not found",
                    },
                    404,
                );
            }
            return c.json({ ok: true, data: destination, error: null });
        },
    )
    .delete(
        "/workspaces/:workspaceId/routing/destinations/:id",
        describeRoute({
            description: "Delete routing destination",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator(
            "param",
            workspaceParam.extend({ id: z.string().uuid() }),
        ),
        async (c) => {
            const { workspaceId, id } = c.req.valid("param");
            const deleted = await new RoutingDestinationService().delete({
                workspaceId,
                id,
            });
            if (!deleted) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Routing destination not found",
                    },
                    404,
                );
            }
            return c.json({ ok: true, data: null, error: null });
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/destinations/import-from-allowed-remote/:allowedRemoteId",
        describeRoute({
            description: "Import DIMSE destination from allowed remote",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator(
            "param",
            workspaceParam.extend({
                allowedRemoteId: z.string().uuid(),
            }),
        ),
        async (c) => {
            const { workspaceId, allowedRemoteId } = c.req.valid("param");
            const destination =
                await new RoutingDestinationService().importFromAllowedRemote({
                    workspaceId,
                    allowedRemoteId,
                });
            if (!destination) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Allowed remote not found",
                    },
                    400,
                );
            }
            return c.json({ ok: true, data: destination, error: null }, 201);
        },
    );

export default destinationsRoute;
