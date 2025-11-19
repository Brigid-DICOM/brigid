import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { TagEntity } from "@brigid/database/src/entities/tag.entity";
import { TAG_TARGET_TYPE, TagAssignmentEntity, type TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import type { EntityManager } from "typeorm";

export class TagService {
    private readonly entityManager: EntityManager;
    
    constructor(entityManager?: EntityManager) {
        this.entityManager = entityManager ?? AppDataSource.manager;
    }

    async createTag(options: {
        workspaceId: string;
        name: string;
        color: string;
    }) {
        const tag = new TagEntity();

        tag.name = options.name;
        tag.color = options.color;
        tag.workspaceId = options.workspaceId;

        return await this.entityManager.save(TagEntity, tag);
    }

    /**
     * 
     * @param options 
     * @returns The updated tag or null if the tag was not found
     */
    async updateTag(options: {
        workspaceId: string;
        tagId: string;
        name?: string;
        color?: string;
    }) {
        const tag = await this.entityManager.findOne(TagEntity, {
            where: {
                id: options.tagId,
                workspaceId: options.workspaceId
            }
        });

        if (!tag) return null;

        if (options.name) {
            tag.name = options.name;
        }

        if (options.color) {
            tag.color = options.color;
        }

        return await this.entityManager.save(TagEntity, tag);
    }

    /**
     * 
     * @param options 
     * @returns The deleted tag or null if the tag was not found
     */
    async deleteTag(options: {
        workspaceId: string;
        tagId: string;
    }) {
        const tag = await this.entityManager.findOne(TagEntity, {
            where: {
                id: options.tagId,
                workspaceId: options.workspaceId
            }
        });

        if (!tag) return null;

        return await this.entityManager.remove(TagEntity, tag);
    }

    /**
     * 
     * @param options 
     * @returns The assigned tag or null if the tag was not found
     */
    async assignTag(options: {
        workspaceId: string;
        tagId: string;
        targetType: TagTargetType;
        targetId: string;
    }) {
        const tag = await this.entityManager.findOne(TagEntity, {
            where: {
                id: options.tagId,
                workspaceId: options.workspaceId
            }
        });

        if (!tag) return null;

        let targetEntity: typeof StudyEntity | typeof SeriesEntity | typeof InstanceEntity;
        let targetIdField: string;
        switch (options.targetType) {
            case TAG_TARGET_TYPE.STUDY:
                targetEntity = StudyEntity;
                targetIdField = "studyInstanceUid";
                break;
            case TAG_TARGET_TYPE.SERIES:
                targetEntity = SeriesEntity;
                targetIdField = "seriesInstanceUid";
                break;
            case TAG_TARGET_TYPE.INSTANCE:
                targetEntity = InstanceEntity;
                targetIdField = "sopInstanceUid";
                break;
            default:
                throw new Error(`Invalid target type: ${options.targetType}`);
        }

        const target = await this.entityManager.findOne(targetEntity, {
            where: {
                [targetIdField]: options.targetId,
                workspaceId: options.workspaceId
            }
        });

        if (!target) return null;

        const existingAssignment = await this.entityManager.findOne(TagAssignmentEntity, {
            where: {
                tagId: options.tagId,
                targetType: options.targetType,
                targetId: options.targetId,
                workspaceId: options.workspaceId
            }
        });
        if (existingAssignment) return existingAssignment;

        const assignment = new TagAssignmentEntity();
        assignment.tagId = options.tagId;
        assignment.targetType = options.targetType;
        assignment.targetId = options.targetId;
        assignment.workspaceId = options.workspaceId;

        return await this.entityManager.save(TagAssignmentEntity, assignment);
    }

    async removeTagAssignment(options: {
        workspaceId: string;
        assignmentId: string;
    }) {
        const assignment = await this.entityManager.findOne(TagAssignmentEntity, {
            where: {
                id: options.assignmentId,
                workspaceId: options.workspaceId
            }
        });

        if (!assignment) return null;

        return await this.entityManager.remove(TagAssignmentEntity, assignment);
    }

    async getTargetTags(options: {
        workspaceId: string;
        targetType: TagTargetType;
        targetId: string;
    }) {
        return await this.entityManager.find(TagEntity, {
            where: {
                workspaceId: options.workspaceId,
                assignments: {
                    targetType: options.targetType,
                    targetId: options.targetId
                }
            },
            relations: {
                assignments: true
            }
        });
    }

    async getWorkspaceTags(workspaceId: string, name?: string) {
        const queryBuilder = this.entityManager
            .createQueryBuilder(TagEntity, "tag")
            .where("tag.workspaceId = :workspaceId", { workspaceId })

        if (name) {
            queryBuilder.andWhere("tag.name = :name", { name });
            }
        
        return await queryBuilder.getMany();
    }
}