import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn, 
    Unique,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { ShareLinkEntity } from "./shareLink.entity";
import type { UserEntity } from "./user.entity";

@Entity("share_link_recipient")
@Unique(["shareLinkId", "userId"])
export class ShareLinkRecipientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    shareLinkId!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "int", default: 0 })
    permissions!: number;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @ManyToOne("ShareLinkEntity", "recipients", { onDelete: "CASCADE" })
    @JoinColumn({ name: "shareLinkId", referencedColumnName: "id" })
    shareLink!: ShareLinkEntity;

    @ManyToOne("UserEntity", { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: UserEntity;
}