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

@Entity("dimse_allowed_remote")
export class DimseAllowedRemoteEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    dimseConfigId!: string;

    @Column({ type: "varchar", length: 16 })
    aeTitle!: string;

    @Column({ type: "varchar", length: 255 })
    host!: string;

    @Column({ type: "int" })
    port!: number;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @ManyToOne("DimseConfigEntity", "allowedRemotes", { onDelete: "CASCADE" })
    @JoinColumn({ name: "dimseConfigId", referencedColumnName: "id" })
    dimseConfig!: DimseConfigEntity;
}