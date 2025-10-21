import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";

// 0040,0275 Request Attributes Sequence Attribute
@Entity("series_request_attributes")
export class SeriesRequestAttributesEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, comment: "0020,000D", nullable: true })
    studyInstanceUid?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0050", nullable: true })
    accessionNumber?: string | null;

    @Column({ type: "varchar", length: 255, comment: "(0008,0051).(0040,0031)", nullable: true })
    accLocalNamespaceEntityId?: string | null;

    @Column({ type: "varchar", length: 255, comment: "(0008,0051).(0040,0032)", nullable: true })
    accUniversalEntityId?: string | null;

    @Column({ type: "varchar", length: 255, comment: "(0008,0051).(0040,0033)", nullable: true })
    accUniversalEntityIdType?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0040,1001", nullable: true })
    requestedProcedureId?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0040,0009", nullable: true })
    scheduledProcedureStepId?: string | null;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;
}
