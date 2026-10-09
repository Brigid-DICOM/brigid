import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { RoutingRuleService } from "@/server/routing/ruleService";
import {
    createRuleSchema,
    updateRuleSchema,
} from "@/server/schemas/routingSchema";

const workspaceParam = z.object({
    workspaceId: z.string(),
});

const rulesRoute = new Hono()
    .get(
        "/workspaces/:workspaceId/routing/rules",
        describeRoute({
            description: "List routing rules",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("param", workspaceParam),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const rules = await new RoutingRuleService().list(workspaceId);
            return c.json({ ok: true, data: { rules }, error: null });
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/rules",
        describeRoute({
            description: "Create routing rule",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator("param", workspaceParam),
        zValidator("json", createRuleSchema),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const body = c.req.valid("json");
            try {
                const rule = await new RoutingRuleService().create({
                    workspaceId,
                    ...body,
                });
                return c.json({ ok: true, data: rule, error: null }, 201);
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
        "/workspaces/:workspaceId/routing/rules/:id",
        describeRoute({
            description: "Update routing rule",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator(
            "param",
            workspaceParam.extend({ id: z.string().uuid() }),
        ),
        zValidator("json", updateRuleSchema),
        async (c) => {
            const { workspaceId, id } = c.req.valid("param");
            const body = c.req.valid("json");
            try {
                const rule = await new RoutingRuleService().update({
                    workspaceId,
                    id,
                    ...body,
                });
                if (!rule) {
                    return c.json(
                        {
                            ok: false,
                            data: null,
                            error: "Routing rule not found",
                        },
                        404,
                    );
                }
                return c.json({ ok: true, data: rule, error: null });
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
    .delete(
        "/workspaces/:workspaceId/routing/rules/:id",
        describeRoute({
            description: "Delete routing rule",
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
            const deleted = await new RoutingRuleService().delete({
                workspaceId,
                id,
            });
            if (!deleted) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Routing rule not found",
                    },
                    404,
                );
            }
            return c.json({ ok: true, data: null, error: null });
        },
    );

export default rulesRoute;
