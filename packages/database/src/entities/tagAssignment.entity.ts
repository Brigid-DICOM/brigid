import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { TagEntity } from "./tag.entity";
import type { WorkspaceEntity } from "./workspace.entity";

export const TAG_TARGET_TYPE = {
    STUDY: "study",
    SERIES: "series",
    INSTANCE: "instance"
} as const;

export type TagTargetType = (typeof TAG_TARGET_TYPE)[keyof typeof TAG_TARGET_TYPE];

@Entity("tag_assignment")
export class TagAssignmentEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    tagId!: string;

    @Column({ type: "varchar", length: 50 })
    targetType!: TagTargetType;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @Column({ type: "varchar" })
    targetId!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @ManyToOne("tag", "assignments", { onDelete: "CASCADE" })
    @JoinColumn({ name: "tagId", referencedColumnName: "id" })
    tag!: TagEntity;

    @ManyToOne("workspace", "tagAssignments", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}