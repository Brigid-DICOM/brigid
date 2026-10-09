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

export type RoutingDestinationType = "dimse" | "dicomweb";
export type RoutingAuthType = "none" | "basic" | "bearer";

@Entity("routing_destination")
export class RoutingDestinationEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    workspaceId!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", length: 16 })
    type!: RoutingDestinationType;

    @Column({ type: "boolean", default: true })
    enabled!: boolean;

    @Column({ type: "varchar", length: 16, nullable: true })
    aeTitle?: string | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    host?: string | null;

    @Column({ type: "int", nullable: true })
    port?: number | null;

    @Column({ type: "varchar", length: 2048, nullable: true })
    baseUrl?: string | null;

    @Column({ type: "varchar", length: 16, nullable: true })
    authType?: RoutingAuthType | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    authUsername?: string | null;

    @Column({ type: "text", nullable: true })
    authSecretEncrypted?: string | null;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @ManyToOne("WorkspaceEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}
