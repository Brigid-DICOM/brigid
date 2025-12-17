import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { DimseConfigEntity } from "./dimseConfig.entity";

@Entity("dimse_allowed_ip")
export class DimseAllowedIpEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    dimseConfigId!: string;

    @Column({ type: "varchar", length: 50 })
    ipMask!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @ManyToOne("DimseConfigEntity", "allowedIps", { onDelete: "CASCADE" })
    @JoinColumn({ name: "dimseConfigId", referencedColumnName: "id" })
    dimseConfig!: DimseConfigEntity;
}