//  from [Table 8.8-1a. Basic Code Sequence Macro Attributes](https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_8.8.html#table_8.8-1a)

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("dicom_code_sequence")
export class DicomCodeSequenceEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 255, comment: "0008,0100 or 0008,0119 or 0008,0120" })
    codeValue!: string;

    @Column({ type: "varchar", length: 255, comment: "0008,0102", nullable: true })
    codingSchemeDesignator!: string;

    @Column({ type: "varchar", length: 255, comment: "0008,0103", nullable: true })
    codingSchemeVersion!: string;

    @Column({ type: "varchar", length: 255, comment: "0008,0104" })
    codeMeaning!: string;
}