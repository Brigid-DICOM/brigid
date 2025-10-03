import { 
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { transformer } from "../utils/transformer";

@Entity("verification_token")
export class VerificationTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar" })
    token!: string;

    @Column({ type: "varchar" })
    identifier!: string;

    @Column({ type: "varchar", transformer: transformer.date })
    expires!: string;
}