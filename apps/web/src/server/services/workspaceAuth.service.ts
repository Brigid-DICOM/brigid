import { WorkspaceNoPermissionError } from "@/errors/workspaceNoPermissionError";
import {
    WORKSPACE_PERMISSION_NAMES,
    type WorkspacePermissionsType,
} from "../const/workspace.const";
import { hasPermission } from "../utils/workspacePermissions";
import { WorkspaceService } from "./workspace.service";

export interface WorkspaceAuthContext {
    userId: string;
    workspaceId: string;
}

export class WorkspaceAuthService {
    private workspaceService: WorkspaceService;

    constructor() {
        this.workspaceService = new WorkspaceService();
    }

    async checkPermission(
        context: WorkspaceAuthContext,
        requiredPermission: WorkspacePermissionsType,
    ) {
        const permissions =
            await this.workspaceService.getUserWorkspacePermissions(
                context.userId,
                context.workspaceId,
            );

        return hasPermission(permissions, requiredPermission);
    }

    async requirePermission(
        context: WorkspaceAuthContext,
        requiredPermission: WorkspacePermissionsType,
    ) {
        const hasPermission = await this.checkPermission(
            context,
            requiredPermission,
        );
        if (!hasPermission) {
            throw new WorkspaceNoPermissionError(
                `User does not have the required permission: ${WORKSPACE_PERMISSION_NAMES[requiredPermission]}`,
            );
        }
    }
}
