import { AppDataSource } from "@brigid/database";
import { RoutingTagEntity } from "@brigid/database/src/entities/routingTag.entity";
import type { EntityManager } from "typeorm";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import { BUILT_IN_ROUTING_TAGS } from "./ruleEngine";

function isValidTagKey(tagKey: string): boolean {
    if (/^[0-9A-Fa-f]{8}$/.test(tagKey)) {
        return true;
    }
    return tagKey in DICOM_TAG_KEYWORD_REGISTRY;
}

export class RoutingTagService {
    private readonly entityManager: EntityManager;

    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    getBuiltInTags() {
        return BUILT_IN_ROUTING_TAGS;
    }

    async list(workspaceId: string): Promise<RoutingTagEntity[]> {
        return this.entityManager.find(RoutingTagEntity, {
            where: { workspaceId },
            order: { createdAt: "ASC" },
        });
    }

    async create(options: {
        workspaceId: string;
        tagKey: string;
        label?: string;
    }): Promise<RoutingTagEntity> {
        if (
            BUILT_IN_ROUTING_TAGS.some((tag) => tag.tagKey === options.tagKey)
        ) {
            throw new Error(
                `Tag "${options.tagKey}" is already a built-in tag`,
            );
        }

        if (!isValidTagKey(options.tagKey)) {
            throw new Error(`Invalid DICOM tag keyword: ${options.tagKey}`);
        }

        const existing = await this.entityManager.findOne(RoutingTagEntity, {
            where: { workspaceId: options.workspaceId, tagKey: options.tagKey },
        });
        if (existing) {
            throw new Error(`Tag "${options.tagKey}" already exists`);
        }

        const tag = new RoutingTagEntity();
        tag.workspaceId = options.workspaceId;
        tag.tagKey = options.tagKey;
        tag.label = options.label ?? null;

        return this.entityManager.save(RoutingTagEntity, tag);
    }

    async delete(options: {
        workspaceId: string;
        id: string;
    }): Promise<RoutingTagEntity | null> {
        const tag = await this.entityManager.findOne(RoutingTagEntity, {
            where: { id: options.id, workspaceId: options.workspaceId },
        });
        if (!tag) return null;

        return this.entityManager.remove(RoutingTagEntity, tag);
    }
}
