import { AppDataSource } from "@brigid/database";
import { DimseAllowedRemoteEntity } from "@brigid/database/src/entities/dimseAllowedRemote.entity";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import {
    type RoutingAuthType,
    RoutingDestinationEntity,
    type RoutingDestinationType,
} from "@brigid/database/src/entities/routingDestination.entity";
import type { EntityManager } from "typeorm";
import { encryptRoutingSecret } from "./credentialCrypto";

export type RoutingDestinationDto = Omit<
    RoutingDestinationEntity,
    "authSecretEncrypted"
> & { hasAuthSecret: boolean };

export type CreateRoutingDestinationInput = {
    workspaceId: string;
    name: string;
    type: RoutingDestinationType;
    enabled?: boolean;
    aeTitle?: string | null;
    host?: string | null;
    port?: number | null;
    baseUrl?: string | null;
    authType?: RoutingAuthType | null;
    authUsername?: string | null;
    authSecret?: string | null;
    description?: string | null;
};

export type UpdateRoutingDestinationInput = {
    workspaceId: string;
    id: string;
} & Partial<Omit<CreateRoutingDestinationInput, "workspaceId">>;

function toDto(destination: RoutingDestinationEntity): RoutingDestinationDto {
    const { authSecretEncrypted, ...rest } = destination;
    return { ...rest, hasAuthSecret: Boolean(authSecretEncrypted) };
}

export class RoutingDestinationService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async list(workspaceId: string): Promise<RoutingDestinationDto[]> {
        const destinations = await this.entityManager.find(
            RoutingDestinationEntity,
            {
                where: { workspaceId },
                order: { createdAt: "ASC" },
            },
        );
        return destinations.map(toDto);
    }

    async create(
        input: CreateRoutingDestinationInput,
    ): Promise<RoutingDestinationDto> {
        const destination = new RoutingDestinationEntity();
        destination.workspaceId = input.workspaceId;
        destination.name = input.name;
        destination.type = input.type;
        destination.enabled = input.enabled ?? true;
        destination.aeTitle = input.aeTitle ?? null;
        destination.host = input.host ?? null;
        destination.port = input.port ?? null;
        destination.baseUrl = input.baseUrl ?? null;
        destination.authType = input.authType ?? "none";
        destination.authUsername = input.authUsername ?? null;
        destination.authSecretEncrypted = input.authSecret
            ? encryptRoutingSecret(input.authSecret)
            : null;
        destination.description = input.description ?? null;

        const saved = await this.entityManager.save(
            RoutingDestinationEntity,
            destination,
        );
        return toDto(saved);
    }

    async update(
        input: UpdateRoutingDestinationInput,
    ): Promise<RoutingDestinationDto | null> {
        const destination = await this.entityManager.findOne(
            RoutingDestinationEntity,
            {
                where: { id: input.id, workspaceId: input.workspaceId },
            },
        );
        if (!destination) return null;

        if (input.name !== undefined) destination.name = input.name;
        if (input.type !== undefined) destination.type = input.type;
        if (input.enabled !== undefined) destination.enabled = input.enabled;
        if (input.aeTitle !== undefined) destination.aeTitle = input.aeTitle;
        if (input.host !== undefined) destination.host = input.host;
        if (input.port !== undefined) destination.port = input.port;
        if (input.baseUrl !== undefined) destination.baseUrl = input.baseUrl;
        if (input.authType !== undefined)
            destination.authType = input.authType;
        if (input.authUsername !== undefined)
            destination.authUsername = input.authUsername;
        if (input.authSecret !== undefined) {
            destination.authSecretEncrypted = input.authSecret
                ? encryptRoutingSecret(input.authSecret)
                : null;
        }
        if (input.description !== undefined)
            destination.description = input.description;

        const saved = await this.entityManager.save(
            RoutingDestinationEntity,
            destination,
        );
        return toDto(saved);
    }

    async delete(options: {
        workspaceId: string;
        id: string;
    }): Promise<RoutingDestinationEntity | null> {
        const destination = await this.entityManager.findOne(
            RoutingDestinationEntity,
            {
                where: { id: options.id, workspaceId: options.workspaceId },
            },
        );
        if (!destination) return null;

        return this.entityManager.remove(RoutingDestinationEntity, destination);
    }

    async importFromAllowedRemote(options: {
        workspaceId: string;
        allowedRemoteId: string;
    }): Promise<RoutingDestinationDto | null> {
        const config = await this.entityManager.findOne(DimseConfigEntity, {
            where: { workspaceId: options.workspaceId },
        });
        if (!config) return null;

        const remote = await this.entityManager.findOne(
            DimseAllowedRemoteEntity,
            {
                where: { id: options.allowedRemoteId, dimseConfigId: config.id },
            },
        );
        if (!remote) return null;

        return this.create({
            workspaceId: options.workspaceId,
            name: remote.aeTitle,
            type: "dimse",
            aeTitle: remote.aeTitle,
            host: remote.host,
            port: remote.port,
            description: remote.description ?? undefined,
        });
    }
}
