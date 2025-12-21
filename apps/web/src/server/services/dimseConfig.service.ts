import { AppDataSource } from "@brigid/database";
import { DimseAllowedIpEntity } from "@brigid/database/src/entities/dimseAllowedIp.entity";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import env from "@brigid/env";
import type { EntityManager } from "typeorm";

export class DimseConfigService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async getDimseConfig(workspaceId: string) {
        return await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId },
            relations: {
                allowedIps: true,
                allowedRemotes: true,
            },
        });
    }

    async createDimseConfig(options: {
        workspaceId: string;
        aeTitle: string;
        enabled?: boolean;
    }) {
        const { DimseApp } = await import("@/server/dimse");

        const config = new DimseConfigEntity();
        config.workspaceId = options.workspaceId;
        config.aeTitle = options.aeTitle;
        config.enabled = options.enabled ?? false;

        if (config.enabled) {
            await DimseApp.getInstance(
                env.DIMSE_HOSTNAME as string,
                env.DIMSE_PORT as number,
            ).addApplicationEntityToDevice({
                aeTitle: options.aeTitle,
                workspaceId: options.workspaceId,
            });
        }

        return await this.entityManager.save(DimseConfigEntity, config);
    }

    async updateDimseConfig(options: {
        workspaceId: string;
        aeTitle?: string;
        enabled?: boolean;
    }) {
        const { DimseApp } = await import("@/server/dimse");

        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });
        if (!config) return null;

        if (options.aeTitle !== undefined) {
            config.aeTitle = options.aeTitle;
        }
        if (options.enabled !== undefined) {
            config.enabled = options.enabled;
        }

        if (config.enabled) {
            await DimseApp.getInstance(
                env.DIMSE_HOSTNAME as string,
                env.DIMSE_PORT as number,
            ).addApplicationEntityToDevice({
                aeTitle: config.aeTitle,
                workspaceId: config.workspaceId,
            });
        } else {
            await DimseApp.getInstance(
                env.DIMSE_HOSTNAME as string,
                env.DIMSE_PORT as number,
            ).removeApplicationEntityFromDevice(config.aeTitle);
        }

        return await this.entityManager.save(DimseConfigEntity, config);
    }

    async deleteDimseConfig(workspaceId: string) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId },
        });

        if (!config) return null;

        return await this.entityManager.remove(DimseConfigEntity, config);
    }

    // #region Allowed IPs
    async addAllowedIp(options: {
        workspaceId: string;
        ipMask: string;
        description?: string;
    }) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });

        if (!config) return null;

        const allowedIp = new DimseAllowedIpEntity();
        allowedIp.dimseConfigId = config.id;
        allowedIp.ipMask = options.ipMask;
        allowedIp.description = options.description ?? null;

        return await this.entityManager.save(DimseAllowedIpEntity, allowedIp);
    }

    async removeAllowedIp(options: {
        workspaceId: string;
        allowedIpId: string;
    }) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });

        if (!config) return null;

        const allowedIp = await this.entityManager.findOne(
            DimseAllowedIpEntity,
            {
                where: { id: options.allowedIpId, dimseConfigId: config.id },
            },
        );

        if (!allowedIp) return null;

        return await this.entityManager.remove(DimseAllowedIpEntity, allowedIp);
    }

    // #endregion Allowed IPs

    // #region Allowed Remotes

    async addAllowedRemote(options: {
        workspaceId: string;
        aeTitle: string;
        host: string;
        port: number;
        description?: string;
    }) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });

        if (!config) return null;

        const remote = new DimseAllowedRemoteEntity();
        remote.dimseConfigId = config.id;
        remote.aeTitle = options.aeTitle;
        remote.host = options.host;
        remote.port = options.port;
        remote.description = options.description ?? null;

        return await this.entityManager.save(DimseAllowedRemoteEntity, remote);
    }

    async updateAllowedRemote(options: {
        workspaceId: string;
        remoteId: string;
        aeTitle?: string;
        host?: string;
        port?: number;
        description?: string;
    }) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });

        if (!config) return null;

        const remote = await this.entityManager.findOne(
            DimseAllowedRemoteEntity,
            {
                where: { id: options.remoteId, dimseConfigId: config.id },
            },
        );

        if (!remote) return null;

        if (options.aeTitle !== undefined) remote.aeTitle = options.aeTitle;
        if (options.host !== undefined) remote.host = options.host;
        if (options.port !== undefined) remote.port = options.port;
        if (options.description !== undefined)
            remote.description = options.description;

        return await this.entityManager.save(DimseAllowedRemoteEntity, remote);
    }

    async removeAllowedRemote(options: {
        workspaceId: string;
        remoteId: string;
    }) {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });

        if (!config) return null;

        const remote = await this.entityManager.findOne(
            DimseAllowedRemoteEntity,
            {
                where: { id: options.remoteId, dimseConfigId: config.id },
            },
        );

        if (!remote) return null;

        return await this.entityManager.remove(
            DimseAllowedRemoteEntity,
            remote,
        );
    }

    // #endregion Allowed Remotes
}
