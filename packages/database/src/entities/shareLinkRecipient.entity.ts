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

    @ManyToOne("user", { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user!: UserEntity;
}