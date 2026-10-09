import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { RoutingTagService } from "@/server/routing/tagService";
import { createRoutingTagSchema } from "@/server/schemas/routingSchema";

const workspaceParam = z.object({
    workspaceId: z.string(),
});

const tagsRoute = new Hono()
    .get(
        "/workspaces/:workspaceId/routing/tags/built-in",
        describeRoute({
            description: "List built-in routing tags",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("param", workspaceParam),
        async (c) => {
            const tags = new RoutingTagService().getBuiltInTags();
            return c.json({ ok: true, data: { tags }, error: null });
        },
    )
    .get(
        "/workspaces/:workspaceId/routing/tags",
        describeRoute({
            description: "List user routing tags",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("param", workspaceParam),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const tags = await new RoutingTagService().list(workspaceId);
            return c.json({ ok: true, data: { tags }, error: null });
        },
    )
    .post(
        "/workspaces/:workspaceId/routing/tags",
        describeRoute({
            description: "Create user routing tag",
            tags: ["Routing"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.MANAGE),
        zValidator("param", workspaceParam),
        zValidator("json", createRoutingTagSchema),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const { tagKey, label } = c.req.valid("json");
            try {
                const tag = await new RoutingTagService().create({
                    workspaceId,
                    tagKey,
                    label: label ?? undefined,
                });
                return c.json({ ok: true, data: tag, error: null }, 201);
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
        "/workspaces/:workspaceId/routing/tags/:id",
        describeRoute({
            description: "Delete user routing tag",
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
            const deleted = await new RoutingTagService().delete({
                workspaceId,
                id,
            });
            if (!deleted) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Routing tag not found",
                    },
                    404,
                );
            }
            return c.json({ ok: true, data: null, error: null });
        },
    );

export default tagsRoute;
