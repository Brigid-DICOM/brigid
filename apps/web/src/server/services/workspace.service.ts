import { AppDataSource } from "@brigid/database/src/dataSource";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import type { Repository } from "typeorm";
import { v5 as uuidV5 } from "uuid";
import { NAMESPACE_FOR_UUID } from "../const/dicom.const";
import { ROLE_PERMISSION_TEMPLATES } from "../const/workspace.const";
import { UserService } from "./user.service";

interface CreateWorkspaceParams {
    name: string;
    ownerId: string;
}

interface CreateUserWorkspaceParams {
    userId: string;
    workspaceId: string;
    role: string;
    permissions: number;
    isDefault?: boolean;
}

interface CreateDefaultWorkspaceParams {
    userId: string;
    userName?: string;
}

interface CreateWorkspaceForUserParams {
    userId: string;
    name: string;
}

export class WorkspaceService {
    private workspaceRepository: Repository<WorkspaceEntity>;
    private userWorkspaceRepository: Repository<UserWorkspaceEntity>;

    constructor() {
        this.workspaceRepository = AppDataSource.getRepository(WorkspaceEntity);
        this.userWorkspaceRepository = AppDataSource.getRepository(UserWorkspaceEntity);
    }

    async createWorkspace({ name, ownerId }: CreateWorkspaceParams) {
        const workspace = this.workspaceRepository.create({ name, ownerId });
        return await this.workspaceRepository.save(workspace);
    }

    async createUserWorkspace({ 
        userId, 
        workspaceId, 
        role, 
        permissions,
        isDefault 
    }: CreateUserWorkspaceParams) {
        const userWorkspace = this.userWorkspaceRepository.create({
            userId,
            workspaceId,
            role,
            permissions,
            isDefault
        });

        return await this.userWorkspaceRepository.save(userWorkspace);
    }

    async createDefaultWorkspace({ userId, userName }: CreateDefaultWorkspaceParams) {
        const existingWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId,
                isDefault: true
            }
        });

        if (existingWorkspace) {
            throw new Error("Default workspace already exists");
        }

        const workspaceName = userName ? `${userName}'s Workspace` : "My Default Workspace";
        const workspace = await this.createWorkspace({ name: workspaceName, ownerId: userId });

        const userWorkspace = await this.createUserWorkspace({
            userId,
            workspaceId: workspace.id,
            role: "owner",
            permissions: ROLE_PERMISSION_TEMPLATES.owner,
            isDefault: true
        });

        return { workspace, userWorkspace };
    }

    async createWorkspaceForUser({ userId, name }: CreateWorkspaceForUserParams) {
        const workspace = await this.createWorkspace({ name, ownerId: userId });

        const userWorkspace = await this.createUserWorkspace({
            userId,
            workspaceId: workspace.id,
            role: "owner",
            permissions: ROLE_PERMISSION_TEMPLATES.owner,
            isDefault: false
        });

        return {
            id: workspace.id,
            name: workspace.name,
            ownerId: workspace.ownerId,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            membership: {
                role: userWorkspace.role,
                permissions: userWorkspace.permissions,
                isDefault: false
            }
        };
    }

    async getWorkspaceById(workspaceId: string) {
        return await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            }
        });
    }

    async getOrCreateSystemWorkspace() {
        const SYSTEM_WORKSPACE_ID = uuidV5("brigid-system-workspace",NAMESPACE_FOR_UUID);
        const userService = new UserService();
        const systemUser = await userService.getGuestUser();

        let workspace = await AppDataSource.getRepository(WorkspaceEntity).findOne({
            where: {
                id: SYSTEM_WORKSPACE_ID
            }
        });

        if (!workspace) {
            workspace = await this.workspaceRepository.save({
                id: SYSTEM_WORKSPACE_ID,
                name: "System Default Workspace",
                ownerId: systemUser.id
            });

            await this.userWorkspaceRepository.save({
                userId: systemUser.id,
                workspaceId: workspace.id,
                role: "owner",
                permissions: ROLE_PERMISSION_TEMPLATES.owner,
                isDefault: true
            });
        }

        return workspace;
    }

    async getWorkspaceForGuestAccess() {
        return await this.getOrCreateSystemWorkspace();
    }

    async getUserWorkspace(userId: string) {
        const userWorkspaces = await this.userWorkspaceRepository.find({
            where: {
                userId
            },
            relations: ["workspace"]
        });

        return userWorkspaces.map((userWorkspace) => ({
            id: userWorkspace.workspace.id,
            name: userWorkspace.workspace.name,
            ownerId: userWorkspace.workspace.ownerId,
            createdAt: userWorkspace.workspace.createdAt,
            updatedAt: userWorkspace.workspace.updatedAt,
            membership: {
                role: userWorkspace.role,
                permissions: userWorkspace.permissions,
                isDefault: userWorkspace.isDefault
            }
        }));
    }

    async getUserWorkspaceById(userId: string, workspaceId: string) {
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId,
                workspaceId
            },
            relations: ["workspace"]
        });

        return userWorkspace;
    }

    async getUserWorkspacePermissions(userId: string, workspaceId: string) {
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId,
                workspaceId
            }
        });

        return userWorkspace?.permissions ?? 0;
    }

    async getDefaultUserWorkspace(userId: string) {
        const userWorkspace = await this.userWorkspaceRepository.findOne({
            where: {
                userId,
                isDefault: true
            },
            relations: ["workspace"]
        });

        return userWorkspace;
    }
}