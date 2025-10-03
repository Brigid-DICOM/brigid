import { 
    Column,
    Entity,
    JoinColumn,
    ManyToOne, 
    PrimaryGeneratedColumn
} from "typeorm";
import { transformer } from "../utils/transformer";
import type { UserEntity } from "./user.entity";

@Entity("session")
export class SessionEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    sessionToken!: string;

    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "varchar", transformer: transformer.date })
    expires!: string;

    // avoid circular dependency
    // from: https://stackoverflow.com/a/77843252, https://github.com/typeorm/typeorm/issues/4526#issuecomment-1899998947
    @ManyToOne("user", "sessions")
    user!: UserEntity;
}