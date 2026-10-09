import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("routing_tag")
export class RoutingTagEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    workspaceId!: string;

    @Column({ type: "varchar", length: 255 })
    tagKey!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    label?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @ManyToOne("WorkspaceEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}
