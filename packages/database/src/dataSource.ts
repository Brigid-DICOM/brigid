import "reflect-metadata";
import env from "@brigid/env";
import { DataSource } from "typeorm";
import { AccountEntity } from "./entities/account.entity";
import { DicomCodeSequenceEntity } from "./entities/dicomCodeSequence.entity";
import { DimseAllowedIpEntity } from "./entities/dimseAllowedIp.entity";
import { DimseAllowedRemoteEntity } from "./entities/dimseAllowedRemote.entity";
import { DimseConfigEntity } from "./entities/dimseConfig.entity";
import { InstanceEntity } from "./entities/instance.entity";
import { PatientEntity } from "./entities/patient.entity";
import { PersonNameEntity } from "./entities/personName.entity";
import { SeriesEntity } from "./entities/series.entity";
import { SeriesRequestAttributesEntity } from "./entities/seriesRequestAttributes.entity";
import { SessionEntity } from "./entities/session.entity";
import { ShareLinkEntity } from "./entities/shareLink.entity";
import { ShareLinkRecipientEntity } from "./entities/shareLinkRecipient.entity";
import { ShareLinkTargetEntity } from "./entities/shareLinkTarget.entity";
import { StudyEntity } from "./entities/study.entity";
import { TagEntity } from "./entities/tag.entity";
import { TagAssignmentEntity } from "./entities/tagAssignment.entity";
import { UserEntity } from "./entities/user.entity";
import { UserWorkspaceEntity } from "./entities/userWorkspace.entity";
import { VerificationTokenEntity } from "./entities/verificationToken.entity";
import { WorkspaceEntity } from "./entities/workspace.entity";
import * as migrations from "./migrations";
import { SeriesSubscriber } from "./subscribers/series.subscriber";
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
        PersonNameEntity,
        PatientEntity,
        StudyEntity,
        SeriesEntity,
        InstanceEntity,
        DicomCodeSequenceEntity,
        SeriesRequestAttributesEntity,
        TagEntity,
        TagAssignmentEntity,
        ShareLinkEntity,
        ShareLinkRecipientEntity,
        ShareLinkTargetEntity,
        DimseConfigEntity,
        DimseAllowedIpEntity,
        DimseAllowedRemoteEntity
    ],
    subscribers: [
        SeriesSubscriber,
    ],
    synchronize: env.IS_LOCAL_APP,
    migrations: migrations,
    migrationsRun: !env.IS_LOCAL_APP,
    migrationsTableName: "typeorm_migrations",
    migrationsTransactionMode: "all",
});

export async function initializeDb() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        const type = AppDataSource.options.type;
        if (type === "sqlite" || type === "better-sqlite3") {
            // 這裡必須套用，因為 SQLite 預設的鎖定機制太嚴格
            await AppDataSource.query("PRAGMA journal_mode = WAL;");
            await AppDataSource.query("PRAGMA busy_timeout = 30000;");
            console.log("SQLite Optimized in initializeDb");
        }
    }
    return AppDataSource;
}
