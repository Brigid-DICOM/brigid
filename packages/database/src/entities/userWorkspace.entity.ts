import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, 
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { UserEntity } from "./user.entity";
import type { WorkspaceEntity } from "./workspace.entity";


@Entity("user_workspace")
export class UserWorkspaceEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "uuid" })
    workspaceId!: string;

    @Column({ type: "varchar", default: "member", length: 255 })
    role!: string;

    @Column({ type: "boolean", default: false })
    isDefault!: boolean;

    @Column({ type: "int", default: 0 })
    permissions!: number;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @ManyToOne("user", "userWorkspaces", { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: UserEntity;

    @ManyToOne("workspace", "members", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}