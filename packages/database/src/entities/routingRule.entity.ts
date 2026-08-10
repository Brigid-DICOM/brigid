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
import type { WorkspaceEntity } from "./workspace.entity";

export type RoutingConditionOperator =
    | "equals"
    | "notEquals"
    | "contains"
    | "in";

export interface RoutingCondition {
    tag: string;
    operator: RoutingConditionOperator;
    value: string | string[];
}

@Entity("routing_rule")
export class RoutingRuleEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    workspaceId!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "boolean", default: true })
    enabled!: boolean;

    @Column({ type: "int", default: 0 })
    priority!: number;

    @Column({ type: "uuid" })
    destinationId!: string;

    @Column({ type: "int", default: 0 })
    delaySeconds!: number;

    @Column({ type: "simple-json" })
    conditions!: RoutingCondition[];

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @ManyToOne("WorkspaceEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @ManyToOne("RoutingDestinationEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "destinationId", referencedColumnName: "id" })
    destination!: RoutingDestinationEntity;
}
