import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import {
    ROLE_PERMISSION_TEMPLATES,
    WORKSPACE_PERMISSIONS,
} from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { WorkspaceService } from "@/server/services/workspace.service";

const workspaceMemberRoute = new Hono()
    .get(
        "/workspaces/:workspaceId/members",
        describeRoute({
            description: "Get workspace members",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator(
            "param",
            z.object({
                workspaceId: z.string().describe("The ID of the workspace"),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const workspaceService = new WorkspaceService();
            const members =
                await workspaceService.getWorkspaceMembers(workspaceId);

            return c.json(
                {
                    members,
                },
                200,
            );
        },
    )
    .post(
        "/workspaces/:workspaceId/members",
        describeRoute({
            description: "Batch add members to a workspace",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.INVITE),
        zValidator(
            "param",
            z.object({
                workspaceId: z.string().describe("The ID of the workspace"),
            }),
        ),
        zValidator(
            "json",
            z.object({
                users: z.array(
                    z.object({
                        userId: z.string().describe("The ID of the user"),
                        role: z
                            .enum(Object.keys(ROLE_PERMISSION_TEMPLATES))
                            .describe("The role of the user"),
                    }),
                ),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const { users } = c.req.valid("json");

            const workspaceService = new WorkspaceService();
            const newMembers = await workspaceService.addMembers({
                workspaceId,
                users: users.map((user) => ({
                    userId: user.userId,
                    role: user.role as keyof typeof ROLE_PERMISSION_TEMPLATES,
                })),
            });

            return c.json(
                {
                    members: newMembers,
                },
                201,
            );
        },
    )
    .patch(
        "/workspaces/:workspaceId/members/batch",
        describeRoute({
            description: "Batch update members' roles in a workspace",
            tags: ["Workspaces"],
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
        zValidator(
            "json",
            z.object({
                users: z.array(
                    z.object({
                        userId: z.string().describe("The ID of the user"),
                        role: z
                            .enum(Object.keys(ROLE_PERMISSION_TEMPLATES))
                            .describe("The role of the user"),
                    }),
                ),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const { users } = c.req.valid("json");

            const workspaceService = new WorkspaceService();
            await workspaceService.updateMembers({
                workspaceId,
                users: users.map((user) => ({
                    userId: user.userId,
                    role: user.role as keyof typeof ROLE_PERMISSION_TEMPLATES,
                })),
            });

            return c.json(
                {
                    ok: true,
                },
                200,
            );
        },
    )
    .post(
        "/workspaces/:workspaceId/members/batch-delete",
        describeRoute({
            description: "Remove a member from a workspace",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.INVITE),
        zValidator(
            "param",
            z.object({
                workspaceId: z.string().describe("The ID of the workspace"),
            }),
        ),
        zValidator(
            "json",
            z.object({
                userIds: z.array(z.string().describe("The ID of the user")),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const { userIds } = c.req.valid("json");

            const workspaceService = new WorkspaceService();

            await workspaceService.removeMembers(workspaceId, userIds);
            return c.json({ ok: true }, 200);
        },
    )
    .delete(
        "/workspaces/:workspaceId/members/leave",
        describeRoute({
            description: "Leave a workspace",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator(
            "param",
            z.object({
                workspaceId: z.string().describe("The ID of the workspace"),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            if (!userId) {
                return c.json({ error: "User not found" }, 404);
            }

            const workspaceService = new WorkspaceService();
            await workspaceService.removeMember(workspaceId, userId);

            return c.json({ ok: true }, 200);
        },
    );

export default workspaceMemberRoute;
