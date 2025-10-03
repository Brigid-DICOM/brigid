import {
    Column,
    Entity,
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { transformer } from "../utils/transformer";
import type { UserEntity } from "./user.entity";

@Entity("account")
export class AccountEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "varchar" })
    type!: string;

    @Column({ type: "varchar" })
    provider!: string;

    @Column({ type: "varchar" })
    providerAccountId!: string;

    @Column({ type: "varchar", nullable: true })
    refresh_token!: string | null;

    @Column({ type: "varchar", nullable: true })
    access_token!: string | null;

    @Column({ type: "bigint", nullable: true, transformer: transformer.bigint })
    expires_at!: number | null;
    
    @Column({ type: "varchar", nullable: true })
    token_type!: string | null;

    @Column({ type: "varchar", nullable: true })
    scope!: string | null;

    @Column({ type: "varchar", nullable: true })
    id_token!: string | null;

    @Column({ type: "varchar", nullable: true })
    session_state!: string | null;

    @ManyToOne("user", "accounts", { 
        createForeignKeyConstraints: true,
        onDelete: "CASCADE" 
    })
    user!: UserEntity;
}