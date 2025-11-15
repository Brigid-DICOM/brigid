import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { DICOM_DELETE_STATUS } from "../const/dicom";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { DicomCodeSequenceEntity } from "./dicomCodeSequence.entity";
import type { SeriesRequestAttributesEntity } from "./seriesRequestAttributes.entity";
import type { StudyEntity } from "./study.entity";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("series")
export class SeriesEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 4000 })
    seriesPath!: string;

    @Column({ type: "varchar", comment: "0020,000D", length: 255 })
    studyInstanceUid!: string;

    @Column({ type: "varchar", comment: "0020,000E", length: 255 })
    seriesInstanceUid!: string;

    @Column({ type: "date", nullable: true, comment: "0008,0021" })
    seriesDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0008,0031", nullable: true })
    seriesTime?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0060" })
    modality!: string;

    @Column({ type: "varchar", length: 4000, comment: "0008,103E", nullable: true })
    seriesDescription?: string | null;

    @Column({ type: "int", comment: "0020,0011", nullable: true })
    seriesNumber?: number | null;

    @Column({ type: "date", nullable: true, comment: "0040,0244" })
    performedProcedureStepStartDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0040,0245", nullable: true })
    performedProcedureStepStartTime?: string | null;

    @Column({ type: "smallint", default: DICOM_DELETE_STATUS.ACTIVE })
    deleteStatus!: number; // 0: active, 1: recycled, 2: deleted

    @Column({ type: getDateTimeType(), nullable: true })
    deletedAt?: Date | null;

    @Column({ type: "text" })
    json!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @Column({ type: "varchar", comment: "0008,103F", nullable: true })
    seriesDescriptionCodeSequenceId?: string | null;

    @Column({ type: "varchar", comment: "0040,0275", nullable: true })
    seriesRequestAttributesId?: string | null;

    @Column({ type: "varchar" })
    localStudyId!: string;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @ManyToOne("dicom_code_sequence", "series", { nullable: true, cascade: true })
    @JoinColumn({ name: "seriesDescriptionCodeSequenceId", referencedColumnName: "id" })
    seriesDescriptionCodeSequence!: DicomCodeSequenceEntity | null;

    @ManyToOne("series_request_attributes", "series", { nullable: true, cascade: true })
    @JoinColumn({ name: "seriesRequestAttributesId", referencedColumnName: "id" })
    seriesRequestAttributes!: SeriesRequestAttributesEntity | null;

    @ManyToOne("study", "series")
    @JoinColumn({ name: "localStudyId", referencedColumnName: "id" })
    study!: StudyEntity;

    @ManyToOne("workspace", "series")
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}