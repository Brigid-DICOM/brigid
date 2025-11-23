import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany, 
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { getDateTimeType } from "../utils/getDateTimeType";
import { transformer } from "../utils/transformer";
import type { AccountEntity } from "./account.entity";
import type { SessionEntity } from "./session.entity";
import type { UserWorkspaceEntity } from "./userWorkspace.entity";

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

    @CreateDateColumn({ type: getDateTimeType() })
    createdAt!: Date;

    @UpdateDateColumn({ type: getDateTimeType() })
    updatedAt!: Date;

    @OneToMany("AccountEntity", "user")
    accounts!: AccountEntity[];

    @OneToMany("SessionEntity", "user")
    sessions!: SessionEntity[];

    @OneToMany("UserWorkspaceEntity", "user")
    userWorkspaces!: UserWorkspaceEntity[];
}