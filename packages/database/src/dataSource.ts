import "reflect-metadata";
import env from "@brigid/env";
import { DataSource } from "typeorm";
import { AccountEntity } from "./entities/account.entity";
import { PersonNameEntity } from "./entities/personName.entity";
import { SessionEntity } from "./entities/session.entity";
import { UserEntity } from "./entities/user.entity";
import { UserWorkspaceEntity } from "./entities/userWorkspace.entity";
import { VerificationTokenEntity } from "./entities/verificationToken.entity";
import { WorkspaceEntity } from "./entities/workspace.entity";
import * as migrations from "./migrations";
import { parseDataSourceConfig } from "./utils/parseDataSourceConfig";

export const AppDataSource = new DataSource({
    ...parseDataSourceConfig(env.TYPEORM_CONNECTION),
    entities: [
        UserEntity, 
        AccountEntity,
        SessionEntity,
        VerificationTokenEntity,
        WorkspaceEntity,
        UserWorkspaceEntity,
        PersonNameEntity
    ],
    synchronize: env.IS_LOCAL_APP,
    migrations: migrations,
    migrationsRun: !env.IS_LOCAL_APP,
    migrationsTableName: "typeorm_migrations",
    migrationsTransactionMode: "all"
});
