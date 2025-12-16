import env from "@brigid/env";
import { createMiddleware } from "hono/factory";
import { WorkspaceNoPermissionError } from "@/errors/workspaceNoPermissionError";
import { WorkspaceService } from "../services/workspace.service";
import { WorkspaceAuthService } from "../services/workspaceAuth.service";
import { appLogger } from "../utils/logger";

const logger = appLogger.child({
    module: "WorkspaceMiddleware",
});

export const verifyWorkspaceExists = createMiddleware(async (c, next) => {
    const workspaceService = new WorkspaceService();

    const workspaceId = c.req.param("workspaceId");

    if (workspaceId && env.NEXT_PUBLIC_ENABLE_AUTH) {
        const workspace = await workspaceService.getWorkspaceById(workspaceId);
        if (!workspace) {
            return c.json(
                {
                    message: "Workspace not found",
                },
                404,
            );
        }
    } else if (workspaceId && !env.NEXT_PUBLIC_ENABLE_AUTH) {
        const workspace = await workspaceService.getWorkspaceForGuestAccess();
        if (!workspace || workspace.id !== workspaceId) {
            return c.json(
                {
                    message: "Workspace not found",
                },
                404,
            );
        }
    }

    await next();
});

export const verifyWorkspacePermission = (permission: number) => {
    return createMiddleware(async (c, next) => {
        const workspaceId = c.req.param("workspaceId") || c.get("workspaceId");
        const authUser = c.get("authUser");
        const userId = authUser?.user?.id;

        if (!userId || !workspaceId) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Unauthorized",
                },
                401,
            );
        }

        const workspaceAuthService = new WorkspaceAuthService();
        try {
            await workspaceAuthService.requirePermission(
                {
                    userId,
                    workspaceId,
                },
                permission,
            );
        } catch (error) {
            if (error instanceof WorkspaceNoPermissionError) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "You do not have permission to access this resource",
                    },
                    403,
                );
            }

            logger.error("Error verifying workspace permission", error);

            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Internal server error",
                },
                500,
            );
        }

        await next();
    });
};
