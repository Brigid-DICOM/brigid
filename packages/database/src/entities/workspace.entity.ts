import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn, 
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { UserEntity } from "./user.entity";
import type { UserWorkspaceEntity } from "./userWorkspace.entity";

@Entity("workspace")
export class WorkspaceEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 4000 })
    name!: string;

    @Column({ type: "varchar" })
    ownerId!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;
   
    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @DeleteDateColumn({ type: getDateTimeType(), nullable: true })
    deletedAt!: Date | null;

    @ManyToOne("user", "workspaces", { onDelete: "CASCADE" })
    @JoinColumn({ name: "ownerId", referencedColumnName: "id" })
    owner!: UserEntity;

    @OneToMany("UserWorkspaceEntity", "workspace")
    members!: UserWorkspaceEntity[];
}