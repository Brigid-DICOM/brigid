import { AppDataSource } from "@brigid/database";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import { Repository } from "typeorm";
import { ROLE_PERMISSION_TEMPLATES } from "../const/workspace.const";

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
}