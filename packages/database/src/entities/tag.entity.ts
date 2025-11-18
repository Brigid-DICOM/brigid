import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {
    getDateTimeType
} from "../utils/getDateTimeType";
import type { TagAssignmentEntity } from "./tagAssignment.entity";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("tag")
export class TagEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 7, comment: "Hex color" })
    color!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @ManyToOne("workspace", "tags")
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @OneToMany("tag_assignment", "tag", { cascade: true })
    assignments!: TagAssignmentEntity[];
}