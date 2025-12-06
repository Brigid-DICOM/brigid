import { AppDataSource } from "@brigid/database/src/dataSource";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import { In, IsNull, type Repository } from "typeorm";
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

interface AddMemberParams {
    workspaceId: string;
    userId: string;
    role: keyof typeof ROLE_PERMISSION_TEMPLATES;
}

interface AddMembersParams {
    workspaceId: string;
    users: {
        userId: string;
        role: keyof typeof ROLE_PERMISSION_TEMPLATES;
    }[];
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

    async getUserWorkspaces(userId: string) {
        const userWorkspaces = await this.userWorkspaceRepository
            .createQueryBuilder("uw")
            .innerJoinAndSelect("uw.workspace", "w")
            .where("uw.userId = :userId", { userId })
            .andWhere("w.deletedAt IS NULL")
            .getMany();

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
                workspaceId,
                workspace: {
                    deletedAt: IsNull()
                }
            },
            relations: ["workspace"]
        });

        return userWorkspace;
    }

    async setUserDefaultWorkspace(userId: string, workspaceId: string) {
        await this.userWorkspaceRepository.update(
            { userId },
            { isDefault: false }
        );

        await this.userWorkspaceRepository.update(
            { userId, workspaceId },
            { isDefault: true }
        );
    }

    async updateWorkspace(workspaceId: string, data: { name?: string }) {
        const workspace = await this.workspaceRepository.findOne({
            where: {
                id: workspaceId
            }
        });

        if (!workspace) return null;

        if (data.name) {
            workspace.name = data.name;
        }

        return await this.workspaceRepository.save(workspace);
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

        if (!userWorkspace || userWorkspace?.workspace === null) {
            const nextDefaultWorkspace = await this.userWorkspaceRepository.findOne({
                where: {
                    userId,
                    isDefault: false,
                    workspace: {
                        deletedAt: IsNull()
                    }
                },
                order: {
                    createdAt: "DESC"
                },
                relations: ["workspace"]
            });

            if (!nextDefaultWorkspace) {
                return null;
            }

            await this.userWorkspaceRepository.update(
                { id: nextDefaultWorkspace.id },
                { isDefault: true }
            );

            return nextDefaultWorkspace;
        }

        return userWorkspace;
    }

    async getWorkspaceMembers(workspaceId: string) {
        const members = await this.userWorkspaceRepository.find({
            where: {
                workspaceId
            },
            relations: ["user"],
            order: { createdAt: "DESC" }
        });

        return members.map(member => ({
            userId: member.user.id,
            name: member.user.name,
            email: member.user.email,
            image: member.user.image,
            role: member.role,
            permissions: member.permissions,
            joinedAt: member.createdAt,
        }));
    }

    async addMember({ workspaceId, userId, role }: AddMemberParams) {
        const existing = await this.userWorkspaceRepository.findOne({
            where: {
                workspaceId,
                userId
            }
        });

        if (existing) {
            throw new Error("User already a member of this workspace");
        }

        const permissions = ROLE_PERMISSION_TEMPLATES[role] || ROLE_PERMISSION_TEMPLATES.viewer;
        
        return await this.createUserWorkspace({
            userId,
            workspaceId,
            role,
            permissions,
            isDefault: false
        });
    }

    async addMembers({ workspaceId, users }: AddMembersParams) {
        // 1. Find existing members to avoid duplicates
        const existingUsers = await this.userWorkspaceRepository.find({
            where: {
                workspaceId,
                userId: In(users.map(user => user.userId))
            }
        });

        const existingUserIds = existingUsers.map(user => user.userId);

        const newUsers = users.filter(user => !existingUserIds.includes(user.userId));

        if (newUsers.length === 0) {
            return [];
        }

        const newUserWorkspaces = newUsers.map(user => {
            const permissions = ROLE_PERMISSION_TEMPLATES[user.role] || ROLE_PERMISSION_TEMPLATES.viewer;
            return this.userWorkspaceRepository.create({
                userId: user.userId,
                workspaceId,
                role: user.role,
                permissions,
                isDefault: false
            });
        });

        return await this.userWorkspaceRepository.save(newUserWorkspaces);
    }

    async updateMembers({ workspaceId, users }: AddMembersParams) {
        // 因為每個成員的角色可能會不同，所以使用 Promise.all 來併行更新所有成員
        const updatePromises = users.map(async (user) => {
            const permissions = ROLE_PERMISSION_TEMPLATES[user.role];
            if (permissions === undefined) return;

            return this.userWorkspaceRepository.update(
                {
                    workspaceId, userId: user.userId
                },
                { role: user.role, permissions }
            );
        });

        await Promise.all(updatePromises);

        return { count: users.length };
    }

    async removeMember(workspaceId: string, userId: string) {
        const workspace = await this.getWorkspaceById(workspaceId);
        if (workspace && workspace.ownerId === userId) {
            throw new Error("Owner cannot be removed from their own workspace");
        }

        await this.userWorkspaceRepository.delete({ workspaceId, userId });
    }

    async removeMembers(workspaceId: string, userIds: string[]) {
        const workspace = await this.getWorkspaceById(workspaceId);

        if (workspace && userIds.includes(workspace.ownerId)) {
            throw new Error("Owner cannot be removed from their own workspace");
        }

        await this.userWorkspaceRepository.delete({
            workspaceId,
            userId: In(userIds)
        });
    }

    async updateMemberRole(workspaceId: string, userId: string, role: keyof typeof ROLE_PERMISSION_TEMPLATES) {
        const permissions = ROLE_PERMISSION_TEMPLATES[role];

        if (permissions === undefined) {
            throw new Error("Invalid role");
        }

        await this.userWorkspaceRepository.update(
            { workspaceId, userId },
            { role, permissions }
        );

        return { userId, role, permissions };
    }

    async deleteWorkspace(workspaceId: string) {
        await this.workspaceRepository.softDelete({ id: workspaceId });

        await this.userWorkspaceRepository.delete({ workspaceId });
    }
}