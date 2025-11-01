import env from "@brigid/env";
import { createMiddleware } from "hono/factory";
import { WorkspaceService } from "../services/workspace.service";

export const verifyWorkspaceExists = createMiddleware(async (c, next) => {
    const workspaceService = new WorkspaceService();

    const workspaceId = c.req.param("workspaceId");
    
    if (workspaceId && env.NEXT_PUBLIC_ENABLE_AUTH) {
        const workspace = await workspaceService.getWorkspaceById(workspaceId);
        if (!workspace) {
            return c.json({
                message: "Workspace not found"
            }, 404);
        }
    } else if (workspaceId && !env.NEXT_PUBLIC_ENABLE_AUTH) {
        const workspace = await workspaceService.getWorkspaceForGuestAccess();
        if (!workspace || workspace.id !== workspaceId) {
            return c.json({
                message: "Workspace not found"
            }, 404);
        }
    }

    await next();
});