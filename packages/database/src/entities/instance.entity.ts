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
import type { SeriesEntity } from "./series.entity";
import type { WorkspaceEntity } from "./workspace.entity";


@Entity("instance")
export class InstanceEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column({ type: "varchar", length: 4000 })
    instancePath!: string;

    @Column({ type: "varchar", comment: "0002,0010", length: 255 })
    transferSyntaxUid!: string;

    @Column({ type: "varchar", comment: "0020,000D", length: 255 })
    studyInstanceUid!: string;

    @Column({ type: "varchar", comment: "0020,000E", length: 255 })
    seriesInstanceUid!: string;

    @Column({ type: "varchar", comment: "0008,0016", length: 255 })
    sopClassUid!: string;

    @Column({ type: "varchar", comment: "0008,0018", length: 255 })
    sopInstanceUid!: string;

    @Column({ type: "date", comment: "0008,0022", nullable: true })
    acquisitionDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0008,0030", nullable: true })
    acquisitionDateTime?: string | null;

    @Column({ type: "date", comment: "0008,0023", nullable: true })
    contentDate?: string | null;

    @Column({ type: "decimal", precision: 12, scale: 6, comment: "0008,0033", nullable: true })
    contentDateTime?: string | null;

    @Column({ type: "int", comment: "0020,0013", nullable: true })
    instanceNumber?: number | null;

    @Column({ type: "int", comment: "0028,0008", nullable: true })
    numberOfFrames?: number | null;

    @Column({ type: "varchar", comment: "0028,1050", length: 255, nullable: true })
    windowCenter?: string | null;

    @Column({ type: "varchar", comment: "0028,1051", length: 255, nullable: true })
    windowWidth?: string | null;

    @Column({ type: "varchar", comment: "0040,A491", length: 255, nullable: true })
    completionFlag?: string | null;

    @Column({ type: "varchar", comment: "0040,A493", length: 255, nullable: true })
    verificationFlag?: string | null;

    @Column({ type: "smallint", default: DICOM_DELETE_STATUS.ACTIVE })
    deleteStatus!: number;

    @Column({ type: "timestamp", nullable: true })
    deletedAt!: Date | null;

    @Column({ type: "text" })
    json!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    hashSum?: string | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;

    @Column({ type: "varchar" })
    workspaceId!: string;

    @Column({ type: "varchar" })
    localSeriesId!: string;

    @ManyToOne("workspace", "instances")
    @JoinColumn({ name: "workspaceId", referencedColumnName: "id" })
    workspace!: WorkspaceEntity;

    @ManyToOne("series", "instances")
    @JoinColumn({ name: "localSeriesId", referencedColumnName: "id" })
    series!: SeriesEntity;
}