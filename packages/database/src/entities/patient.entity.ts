import {
    IsIn
} from "class-validator";
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
import { PATIENT_SEX } from "../const/dicom";
import type { PersonNameEntity } from "./personName.entity";
import type { WorkspaceEntity } from "./workspace.entity";

@Entity("patient")
export class PatientEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    patientNameId!: string;

    @Column({ type: "varchar", length: 255, comment: "0010,0020" })
    dicomPatientId!: string;

    @Column({ type: "varchar", length: 255, nullable: true, comment: "0010,0021" })
    issuerOfPatientId?: string | null;

    @Column({ type: "date", nullable: true, comment: "0010,0030",  })
    birthDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, nullable: true, comment: "0010,0032" })
    birthTime?: string | null;

    @Column({ type: "varchar", length: 255, nullable: true, comment: "0010,0040", default: PATIENT_SEX.OTHER })
    @IsIn(Object.values(PATIENT_SEX))
    sex?: string | null;
    
    @Column({ type: "varchar", comment: "0010,1010", nullable: true })
    age?: string | null;

    @Column({ type: "varchar", comment: "0010,2160", nullable: true })
    ethnicGroup?: string | null;

    @Column({ type: "varchar", comment: "0010,4000", nullable: true })
    comment?: string | null;

    @Column({ type: "text" })
    json!: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @OneToOne("person_name", "id", { nullable: true, cascade: true })
    @JoinColumn({ name: "patientNameId", referencedColumnName: "id" })
    patientName!: PersonNameEntity | null;

    @ManyToOne("workspace", "patients", { onDelete: "CASCADE" })
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;
}