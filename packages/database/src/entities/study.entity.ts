import { IsIn } from "class-validator";
import {
    Column,
    CreateDateColumn, 
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { DICOM_DELETE_STATUS, DICOM_INSTANCE_AVAILABILITY } from "../const/dicom";
import { getDateTimeType } from "../utils/getDateTimeType";
import type { PatientEntity } from "./patient.entity";
import type { PersonNameEntity } from "./personName.entity";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("study")
export class StudyEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 4000 })
    studyPath!: string;

    @Column({ type: "varchar", length: 255, comment: "0010,0020" })
    dicomPatientId!: string;

    @Column({ type: "varchar", length: 255, comment: "0008,0005" })
    characterSet!: string;

    @Column({ type: "date", comment: "0008,0020", nullable: true })
    studyDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0008,0030", nullable: true })
    studyTime?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0050" })
    accessionNumber?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0051", nullable: true })
    @IsIn(Object.values(DICOM_INSTANCE_AVAILABILITY))
    instanceAvailability?: string | null;

    @Column({ type: "varchar", length: 32, comment: "0008,0201", nullable: true })
    timezoneOffsetFromUTC?: string | null;

    @Column({ type: "varchar", length: 4000, comment: "0008,1030", nullable: true })
    studyDescription?: string | null;

    @Column({ type: "varchar", length: 255, comment: "0020,000D" })
    studyInstanceUid!: string;

    @Column({ type: "varchar", length: 255, comment: "0020,0010", nullable: true })
    studyId?: string | null;

    @Column({ type: "int", comment: "0020,1206", nullable: true, default: 0 })
    numberOfStudyRelatedSeries?: number | null;

    @Column({ type: "int", comment: "0020,1208", nullable: true, default: 0 })
    numberOfStudyRelatedInstances?: number | null;

    @Column({ type: "smallint", default: DICOM_DELETE_STATUS.ACTIVE })
    deleteStatus!: number; // 0: active, 1: recycled, 2: deleted

    @Column({ type: getDateTimeType(), nullable: true })
    deletedAt!: Date | null;

    @Column({ type: "text" })
    json!: string;

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;
    
    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @Column({ type: "varchar" })
    patientId!: string;

    @Column({ type: "varchar", comment: "0008,0090", nullable: true })
    referringPhysicianNameId?: string | null;

    @Column({  type: "varchar" })
    workspaceId!: string;

    @ManyToOne("person_name", "id", { nullable: true, cascade: true })
    @JoinColumn({ name: "referringPhysicianNameId", referencedColumnName: "id"})
    referringPhysicianName!: PersonNameEntity | null;

    @ManyToOne("workspace", "studies", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    // 不加入 cascade: true，建議使用 patient id 連結 patient
    @ManyToOne("patient", "studies", { onDelete: "CASCADE" })
    @JoinColumn({ name: "patientId", referencedColumnName: "id" })
    patient!: PatientEntity;
}