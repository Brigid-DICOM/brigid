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

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @ManyToOne("user", "user_workspace", { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: UserEntity;

    @ManyToOne("workspace", "user_workspace", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}