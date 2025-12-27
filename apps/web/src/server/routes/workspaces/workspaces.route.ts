import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { ROLE_PERMISSION_TEMPLATES, WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { WorkspaceService } from "@/server/services/workspace.service";
import getBlueLightConfigRoute from "./bl/getConfig.route";
import deleteInstancesRoute from "./dicom/delete/deleteInstances.route";
import deleteSeriesRoute from "./dicom/delete/deleteSeries.route";
import deleteStudiesRoute from "./dicom/delete/deleteStudies.route";
import recycleInstancesRoute from "./dicom/delete/recycleInstances.route";
import recycleSeriesRoute from "./dicom/delete/recycleSeries.route";
import recycleStudyRoute from "./dicom/delete/recycleStudy.route";
import restoreInstancesRoute from "./dicom/delete/restoreInstances.route";
import restoreSeriesRoute from "./dicom/delete/restoreSeries.route";
import restoreStudyRoute from "./dicom/delete/restoreStudy.route";
import getStatsRoute from "./dicom/getStats.route";
import dimseRoute from "./dimse/dimse.route";
import searchInstancesRoute from "./qido-rs/searchInstances.route";
import searchSeriesRoute from "./qido-rs/searchSeries.route";
import searchStudiesRoute from "./qido-rs/searchStudies.route";
import searchStudySeriesRoute from "./qido-rs/searchStudySeries.route";
import searchStudySeriesInstancesRoute from "./qido-rs/searchStudySeriesInstances.route";
import shareLinkRoute from "./shareLinks/shareLink.route";
import stowRsRoute from "./stow-rs/stowRs.route";
import tagRoute from "./tags/tag.route";
import wadoRsRoute from "./wado-rs";
import uriRetrieveInstanceRoute from "./wado-uri/uriRetrieveInstance.route";
import workspaceMemberRoute from "./workspaceMember.route";

const workspacesRoute = new Hono()
    .route("/", stowRsRoute)
    .route("/", uriRetrieveInstanceRoute)
    .route("/", searchStudiesRoute)
    .route("/", searchStudySeriesRoute)
    .route("/", searchStudySeriesInstancesRoute)
    .route("/", searchSeriesRoute)
    .route("/", searchInstancesRoute)
    .route("/", wadoRsRoute)
    .route("/", getStatsRoute)
    .route("/", recycleInstancesRoute)
    .route("/", recycleSeriesRoute)
    .route("/", recycleStudyRoute)
    .route("/", restoreInstancesRoute)
    .route("/", restoreSeriesRoute)
    .route("/", restoreStudyRoute)
    .route("/", deleteInstancesRoute)
    .route("/", deleteSeriesRoute)
    .route("/", deleteStudiesRoute)
    .route("/", getBlueLightConfigRoute)
    // tags routes
    .route("/", tagRoute)
    // share link routes
    .route("/", shareLinkRoute)
    // workspace routes
    .get(
        "/workspaces",
        describeRoute({
            description: "Get all workspaces",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        async (c) => {
            const workspaceService = new WorkspaceService();
            const authUser = c.get("authUser");

            if (!authUser?.user) {
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const workspaces = await workspaceService.getUserWorkspaces(
                authUser.user.id,
            );
            return c.json({
                workspaces,
            });
        },
    )
    .get(
        "/workspaces/default",
        describeRoute({
            description: "Get default workspace",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        async (c) => {
            if (!env.NEXT_PUBLIC_ENABLE_AUTH) {
                const workspaceService = new WorkspaceService();
                const defaultWorkspace = await workspaceService.getWorkspaceForGuestAccess();

                return c.json({
                    workspace: {
                        id: defaultWorkspace.id,
                        name: defaultWorkspace.name,
                        ownerId: defaultWorkspace.ownerId,
                        membership: {
                            role: "owner",
                            permissions: ROLE_PERMISSION_TEMPLATES.owner,
                            isDefault: true,
                        },
                        createdAt: defaultWorkspace.createdAt,
                        updatedAt: defaultWorkspace.updatedAt ?? new Date(),
                    },
                });
            }

            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;
            if (!userId) {
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const workspaceService = new WorkspaceService();

            const defaultWorkspace =
                await workspaceService.getDefaultUserWorkspace(userId);
            if (!defaultWorkspace) {
                return c.json(
                    {
                        message: "Default workspace not found",
                    },
                    404,
                );
            }

            return c.json({
                workspace: {
                    id: defaultWorkspace.workspace.id,
                    name: defaultWorkspace.workspace.name,
                    ownerId: defaultWorkspace.workspace.ownerId,
                    membership: {
                        role: defaultWorkspace.role,
                        permissions: defaultWorkspace.permissions,
                        isDefault: defaultWorkspace.isDefault,
                    },
                    createdAt: defaultWorkspace.createdAt,
                    updatedAt: defaultWorkspace.updatedAt,
                },
            });
        },
    )
    .get(
        "/workspaces/:workspaceId",
        describeRoute({
            description: "Get workspace by ID",
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
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const workspaceService = new WorkspaceService();
            const userWorkspace = await workspaceService.getUserWorkspaceById(
                userId,
                workspaceId,
            );

            if (!userWorkspace) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Workspace not found",
                    },
                    404,
                );
            }

            return c.json({
                workspace: {
                    id: userWorkspace.workspace.id,
                    name: userWorkspace.workspace.name,
                    ownerId: userWorkspace.workspace.ownerId,
                    membership: {
                        role: userWorkspace.role,
                        permissions: userWorkspace.permissions,
                        isDefault: userWorkspace.isDefault,
                    },
                    createdAt: userWorkspace.workspace.createdAt,
                    updatedAt: userWorkspace.workspace.updatedAt,
                },
            });
        },
    )
    .post(
        "/workspaces",
        describeRoute({
            description: "Create a new workspace",
            tags: ["Workspaces"],
        }),
        verifyAuthMiddleware,
        zValidator(
            "json",
            z.object({
                name: z
                    .string()
                    .min(1)
                    .max(255)
                    .describe("The name of the workspace"),
            }),
        ),
        async (c) => {
            const { name } = c.req.valid("json");
            const authUser = c.get("authUser");

            if (!authUser?.user?.id) {
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const workspaceService = new WorkspaceService();
            const newWorkspace = await workspaceService.createWorkspaceForUser({
                userId: authUser.user.id,
                name,
            });

            return c.json(
                {
                    workspace: newWorkspace,
                },
                201,
            );
        },
    )
    .put(
        "/workspaces/:workspaceId/default",
        describeRoute({
            description: "Set a default workspace",
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
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const workspaceService = new WorkspaceService();
            await workspaceService.setUserDefaultWorkspace(userId, workspaceId);

            return c.json(
                {
                    ok: true,
                },
                200,
            );
        },
    )
    .patch(
        "/workspaces/:workspaceId",
        describeRoute({
            description: "Update a workspace",
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
                name: z.string().min(1).max(255).optional(),
            }),
        ),
        async (c) => {
            const { workspaceId } = c.req.valid("param");
            const { name } = c.req.valid("json");

            const workspaceService = new WorkspaceService();
            const updatedWorkspace = await workspaceService.updateWorkspace(
                workspaceId,
                { name },
            );

            return c.json(
                {
                    workspace: updatedWorkspace,
                },
                200,
            );
        },
    )
    .delete(
        "/workspaces/:workspaceId",
        describeRoute({
            description: "Delete a workspace",
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
        async (c) => {
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            if (!userId) {
                return c.json(
                    {
                        message: "Unauthorized",
                    },
                    401,
                );
            }

            const { workspaceId } = c.req.valid("param");

            const workspaceService = new WorkspaceService();
            await workspaceService.deleteWorkspace(workspaceId);

            const workspaces = await workspaceService.getUserWorkspaces(userId);
            if (workspaces.length === 0) {
                await workspaceService.createDefaultWorkspace({
                    userId,
                    userName: authUser?.user?.name ?? undefined,
                });
            }

            return c.json(
                {
                    ok: true,
                },
                200,
            );
        },
    )
    .route("/", workspaceMemberRoute)
    .route("/", dimseRoute);

export default workspacesRoute;
