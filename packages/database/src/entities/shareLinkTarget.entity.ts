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

@Entity("share_link_target")
@Unique(["shareLinkId", "targetType", "targetId"])
export class ShareLinkTargetEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    shareLinkId!: string;

    @Column({ type: "varchar", length: 50, comment: "target type: study, series, instance" })
    targetType!: string;

    @Column({ type: "varchar" })
    targetId!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @ManyToOne("ShareLinkEntity", "targets", { onDelete: "CASCADE" })
    @JoinColumn({ name: "shareLinkId", referencedColumnName: "id" })
    shareLink!: ShareLinkEntity;
}