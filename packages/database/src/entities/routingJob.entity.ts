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
import type { RoutingDestinationEntity } from "./routingDestination.entity";
import type { RoutingRuleEntity } from "./routingRule.entity";
import type { WorkspaceEntity } from "./workspace.entity";

export type RoutingJobStatus =
    | "queued"
    | "scheduled"
    | "sending"
    | "succeeded"
    | "failed"
    | "dead";

@Entity("routing_job")
export class RoutingJobEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    workspaceId!: string;

    @Column({ type: "uuid" })
    ruleId!: string;

    @Column({ type: "uuid" })
    destinationId!: string;

    @Column({ type: "varchar", length: 64 })
    sopInstanceUid!: string;

    @Column({ type: "varchar", length: 64 })
    studyInstanceUid!: string;

    @Column({ type: "varchar", length: 64 })
    seriesInstanceUid!: string;

    @Column({ type: "varchar", length: 16 })
    status!: RoutingJobStatus;

    @Column({ type: getDateTimeType() })
    scheduledAt!: Date;

    @Column({ type: "int", default: 0 })
    attempt!: number;

    @Column({ type: "text", nullable: true })
    lastError?: string | null;

    @Column({ type: "text", nullable: true })
    warning?: string | null;

    @Column({ type: "boolean", default: false })
    pendingRebuild!: boolean;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @Column({ type: getDateTimeType(), nullable: true })
    completedAt?: Date | null;

    @ManyToOne("WorkspaceEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @ManyToOne("RoutingRuleEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "ruleId", referencedColumnName: "id" })
    rule!: RoutingRuleEntity;

    @ManyToOne("RoutingDestinationEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "destinationId", referencedColumnName: "id" })
    destination!: RoutingDestinationEntity;
}
