import { AppDataSource } from "@brigid/database";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { TagEntity } from "@brigid/database/src/entities/tag.entity";
import { TAG_TARGET_TYPE, TagAssignmentEntity, type TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { type EntityManager, In } from "typeorm";

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

    /**
     * 批次處理 tags：如果 tag 不存在則建立，存在則更新，最後 assign 到所有 targets
     * Batch process tags: create if not exists, update if exists, then assign to all targets
     * @param options 
     */
    async upsertAndAssignTags(options: {
        workspaceId: string;
        tags: { name: string, color: string }[];
        targets: { targetType: TagTargetType, targetId: string }[];
    }) {
        const results: {
            tag: TagEntity;
            assignments: TagAssignmentEntity[];
            created: boolean
        }[] = [];

        for (const tagInput of options.tags) {
            // Find existing tag by name
            let tag = await this.entityManager.findOne(TagEntity, {
                where: {
                    workspaceId: options.workspaceId,
                    name: tagInput.name
                }
            });

            let created = false;

            if (tag) {
                if (tag.color !== tagInput.color) {
                    tag.color = tagInput.color;
                    tag = await this.entityManager.save(TagEntity, tag);
                }
            } else {
                tag = new TagEntity();
                tag.name = tagInput.name;
                tag.color = tagInput.color;
                tag.workspaceId = options.workspaceId;
                tag = await this.entityManager.save(TagEntity, tag);
                created = true;
            }

            // 先將所有 target 的 assignment 找出來，並快取到 map 當中
            // 如果 target 已經有 assignment，則直接使用快取的 assignment，避免重新建立
            const targetIds = options.targets.map(target => target.targetId);
            const existingAssignments = await this.entityManager.find(TagAssignmentEntity, {
                where: {
                    tagId: tag.id,
                    targetId: In(targetIds),
                    workspaceId: options.workspaceId
                }
            });
            const existingAssignmentMap = new Map<string, TagAssignmentEntity>();
            for (const a of existingAssignments) {
                existingAssignmentMap.set(a.targetId, a);
            }

            const assignments: TagAssignmentEntity[] = [];

            for (const target of options.targets) {
                const cachedAssignment = existingAssignmentMap.get(target.targetId);

                if (cachedAssignment) {
                    assignments.push(cachedAssignment);
                    continue;
                }

                const targetExists = await this.verifyTargetExists({
                    workspaceId: options.workspaceId,
                    targetType: target.targetType,
                    targetId: target.targetId
                });
                if (!targetExists) continue;
                
                const assignment = new TagAssignmentEntity();
                assignment.tagId = tag.id;
                assignment.targetType = target.targetType;
                assignment.targetId = target.targetId;
                assignment.workspaceId = options.workspaceId;

                const savedAssignment = await this.entityManager.save(TagAssignmentEntity, assignment);
                assignments.push(savedAssignment);
            }

            results.push({
                tag,
                assignments,
                created
            });
        }

        return results;
    }

    private async verifyTargetExists(options: {
        workspaceId: string;
        targetType: TagTargetType;
        targetId: string;
    }) {
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

        return await this.entityManager.exists(targetEntity, {
            where: {
                [targetIdField]: options.targetId,
                workspaceId: options.workspaceId
            },
        });
    }
}