import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v7 as uuidV7 } from "uuid";
import { getDateTimeType } from "../utils/getDateTimeType";

@Entity("event_log")
export class EventLogEntity {
    @PrimaryColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    requestId?: string | null;

    @Column({ type: "varchar", length: 255 })
    level!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "int", nullable: true, comment: "Elapsed time in milliseconds" })
    elapsedTime?: number | null;

    @Column({ type: "varchar", length: 255, nullable: true })
    workspaceId?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidV7();
        }
    }
}