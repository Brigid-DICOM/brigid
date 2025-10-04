import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

@Entity("person_name")
export class PersonNameEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;
    
    @Column({ type: "varchar" })
    alphabetic!: string;

    @Column({ type: "varchar", nullable: true })
    ideographic!: string | null;

    @Column({ type: "varchar", nullable: true })
    phonetic!: string | null;

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt!: Date;
}