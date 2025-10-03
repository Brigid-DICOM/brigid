import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany, 
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { transformer } from "../utils/transformer";
import type { AccountEntity } from "./account.entity";
import type { SessionEntity } from "./session.entity";

@Entity("user")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", nullable: true, length: 255 })
    name!: string | null;

    @Column({ type: "varchar", nullable: true, length: 255 })
    email!: string | null;

    @Column({ type: "varchar", nullable: true, transformer: transformer.date })
    emailVerified!: string | null;

    @Column({ type: "varchar", nullable: true })
    image!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @OneToMany("account", "userId")
    accounts!: AccountEntity[];

    @OneToMany("session", "userId")
    sessions!: SessionEntity[];
}