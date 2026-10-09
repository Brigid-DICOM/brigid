import { AppDataSource } from "@brigid/database";
import { RoutingDestinationEntity } from "@brigid/database/src/entities/routingDestination.entity";
import {
    type RoutingCondition,
    RoutingRuleEntity,
} from "@brigid/database/src/entities/routingRule.entity";
import type { EntityManager } from "typeorm";

export type CreateRoutingRuleInput = {
    workspaceId: string;
    name: string;
    enabled?: boolean;
    priority?: number;
    destinationId: string;
    delaySeconds?: number;
    conditions: RoutingCondition[];
};

export type UpdateRoutingRuleInput = {
    workspaceId: string;
    id: string;
} & Partial<Omit<CreateRoutingRuleInput, "workspaceId">>;

export class RoutingRuleService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async list(workspaceId: string): Promise<RoutingRuleEntity[]> {
        return this.entityManager.find(RoutingRuleEntity, {
            where: { workspaceId },
            order: { priority: "ASC", createdAt: "ASC" },
        });
    }

    async listEnabled(workspaceId: string): Promise<RoutingRuleEntity[]> {
        return this.entityManager.find(RoutingRuleEntity, {
            where: { workspaceId, enabled: true },
            order: { priority: "ASC" },
        });
    }

    async create(input: CreateRoutingRuleInput): Promise<RoutingRuleEntity> {
        await this.assertDestinationExists(
            input.workspaceId,
            input.destinationId,
        );

        const rule = new RoutingRuleEntity();
        rule.workspaceId = input.workspaceId;
        rule.name = input.name;
        rule.enabled = input.enabled ?? true;
        rule.priority = input.priority ?? 0;
        rule.destinationId = input.destinationId;
        rule.delaySeconds = input.delaySeconds ?? 0;
        rule.conditions = input.conditions;

        return this.entityManager.save(RoutingRuleEntity, rule);
    }

    async update(
        input: UpdateRoutingRuleInput,
    ): Promise<RoutingRuleEntity | null> {
        const rule = await this.entityManager.findOne(RoutingRuleEntity, {
            where: { id: input.id, workspaceId: input.workspaceId },
        });
        if (!rule) return null;

        if (input.destinationId !== undefined) {
            await this.assertDestinationExists(
                input.workspaceId,
                input.destinationId,
            );
            rule.destinationId = input.destinationId;
        }
        if (input.name !== undefined) rule.name = input.name;
        if (input.enabled !== undefined) rule.enabled = input.enabled;
        if (input.priority !== undefined) rule.priority = input.priority;
        if (input.delaySeconds !== undefined)
            rule.delaySeconds = input.delaySeconds;
        if (input.conditions !== undefined) rule.conditions = input.conditions;

        return this.entityManager.save(RoutingRuleEntity, rule);
    }

    async delete(options: {
        workspaceId: string;
        id: string;
    }): Promise<RoutingRuleEntity | null> {
        const rule = await this.entityManager.findOne(RoutingRuleEntity, {
            where: { id: options.id, workspaceId: options.workspaceId },
        });
        if (!rule) return null;

        return this.entityManager.remove(RoutingRuleEntity, rule);
    }

    private async assertDestinationExists(
        workspaceId: string,
        destinationId: string,
    ) {
        const exists = await this.entityManager.exists(
            RoutingDestinationEntity,
            {
                where: { id: destinationId, workspaceId },
            },
        );
        if (!exists) {
            throw new Error("Routing destination not found");
        }
    }
}
