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
import { getDateTimeType } from "../utils/getDateTimeType";
import type { ShareLinkRecipientEntity } from "./shareLinkRecipient.entity";
import type { ShareLinkTargetEntity } from "./shareLinkTarget.entity";
import type { UserEntity } from "./user.entity";

@Entity("share_link")
export class ShareLinkEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    creatorId!: string;

    @Column({ type: "varchar", length: 255, unique: true })
    token!: string;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @Column({
        type: "varchar",
        length: 50,
        default: 0
    })
    publicPermissions!: number;

    @Column({ type: "int" })
    accessCount!: number;

    @Column({
        type: getDateTimeType(),
        nullable: true
    })
    lastAccessedAt?: Date | null;

    @Column({ type: "boolean", default: false })
    requiredPassword!: boolean;

    @Column({ type: "varchar", length: 255, nullable: true })
    passwordHash?: string | null;

    @Column({ type: "int", nullable: true })
    expiresInSec?: number | null;

    @Column({ type: getDateTimeType(), nullable: true })
    expiresAt?: Date | null;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @OneToMany("share_link_target", "shareLinkId", { cascade: true })
    targets!: ShareLinkTargetEntity[];

    @OneToMany("share_link_recipient", "shareLinkId", { cascade: true })
    recipients!: ShareLinkRecipientEntity[];

    @ManyToOne("user", { nullable: true })
    @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
    creator!: UserEntity;
}