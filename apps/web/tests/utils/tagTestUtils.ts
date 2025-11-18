import { TagEntity } from "@brigid/database/src/entities/tag.entity";
import {
    TagAssignmentEntity,
    type TagTargetType,
} from "@brigid/database/src/entities/tagAssignment.entity";
import type { DataSource } from "typeorm";

export class TagTestUtils {
    constructor(private dataSource: DataSource) {}

    async createTag(workspaceId: string, name: string, color: string) {
        const tag = new TagEntity();

        tag.workspaceId = workspaceId;
        tag.name = name;
        tag.color = color;

        return await this.dataSource.manager.save(TagEntity, tag);
    }

    async assignTag(
        workspaceId: string,
        tagId: string,
        targetType: TagTargetType,
        targetId: string,
    ) {
        const assignment = new TagAssignmentEntity();
        assignment.workspaceId = workspaceId;
        assignment.tagId = tagId;
        assignment.targetType = targetType;
        assignment.targetId = targetId;

        return await this.dataSource.manager.save(
            TagAssignmentEntity,
            assignment,
        );
    }

    async getTag(workspaceId: string, tagId: string) {
        return await this.dataSource.manager.findOne(TagEntity, {
            where: {
                workspaceId,
                id: tagId,
            },
        });
    }

    async getTagsByWorkspace(workspaceId: string) {
        return await this.dataSource.manager.find(TagEntity, {
            where: {
                workspaceId,
            },
        });
    }

    async getAssignments(workspaceId: string) {
        return await this.dataSource.manager.find(TagAssignmentEntity, {
            where: { workspaceId },
        });
    }
}
