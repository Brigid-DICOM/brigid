import { IsIn } from "class-validator";
import {
    Column,
    CreateDateColumn, 
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { DICOM_DELETE_STATUS, DICOM_INSTANCE_AVAILABILITY } from "../const/dicom";
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
    studyDate!: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0008,0030", nullable: true })
    studyTime!: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0050" })
    accessionNumber!: string | null;

    @Column({ type: "varchar", length: 255, comment: "0008,0051", nullable: true })
    @IsIn(Object.values(DICOM_INSTANCE_AVAILABILITY))
    instanceAvailability!: string | null;

    @Column({ type: "varchar", length: 32, comment: "0008,0201", nullable: true })
    timezoneOffsetFromUTC!: string | null;

    @Column({ type: "varchar", length: 4000, comment: "0008,1030", nullable: true })
    studyDescription!: string | null;

    @Column({ type: "varchar", length: 255, comment: "0020,000D", nullable: true })
    studyInstanceUid!: string | null;

    @Column({ type: "varchar", length: 255, comment: "0020,0010", nullable: true })
    studyId!: string | null;

    @Column({ type: "int", comment: "0020,1206", nullable: true })
    numberOfStudyRelatedSeries!: number | null;

    @Column({ type: "int", comment: "0020,1208", nullable: true })
    numberOfStudyRelatedInstances!: number | null;

    @Column({ type: "smallint", default: DICOM_DELETE_STATUS.ACTIVE })
    deleteStatus!: number; // 0: active, 1: recycled, 2: deleted

    @Column({ type: "timestamp", nullable: true })
    deletedAt!: Date | null;

    @Column({ type: "text" })
    json!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;
    
    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "varchar", length: 255 })
    patientId!: string;

    @Column({ type: "varchar", comment: "0008,0090" })
    referringPhysicianNameId!: string | null;

    @Column({  type: "varchar" })
    workspaceId!: string;

    @OneToOne("person_name", "id", { nullable: true })
    @JoinColumn({ name: "referringPhysicianNameId", referencedColumnName: "id"})
    referringPhysicianName!: PersonNameEntity | null;

    @ManyToOne("workspace", "studies", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @ManyToOne("patient", "studies", { onDelete: "CASCADE" })
    @JoinColumn({ name: "patientId", referencedColumnName: "id" })
    patient!: PatientEntity;
}