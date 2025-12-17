import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { DimseAllowedIpEntity } from "./dimseAllowedIp.entity";
import type { DimseAllowedRemoteEntity } from "./dimseAllowedRemote.entity";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("dimse_config")
export class DimseConfigEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 16, unique: true })
    aeTitle!: string;

    @Column({ type: "uuid", unique: true })
    workspaceId!: string;

    @Column({ type: "boolean", default: false })
    enabled!: boolean;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @OneToOne("workspace", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @OneToMany("DimseAllowedIpEntity", "dimseConfig", { cascade: true })
    allowedIps!: DimseAllowedIpEntity[];

    @OneToMany("DimseAllowedRemoteEntity", "dimseConfig", { cascade: true })
    allowedRemotes!: DimseAllowedRemoteEntity[];
}