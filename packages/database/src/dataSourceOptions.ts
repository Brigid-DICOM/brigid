import type { DataSourceOptions } from "typeorm";
import { AccountEntity } from "./entities/account.entity";
import { DicomCodeSequenceEntity } from "./entities/dicomCodeSequence.entity";
import { DimseAllowedIpEntity } from "./entities/dimseAllowedIp.entity";
import { DimseAllowedRemoteEntity } from "./entities/dimseAllowedRemote.entity";
import { DimseConfigEntity } from "./entities/dimseConfig.entity";
import { EventLogEntity } from "./entities/eventLog.entity";
import { InstanceEntity } from "./entities/instance.entity";
import { PatientEntity } from "./entities/patient.entity";
import { PersonNameEntity } from "./entities/personName.entity";
import { RoutingDestinationEntity } from "./entities/routingDestination.entity";
import { RoutingJobEntity } from "./entities/routingJob.entity";
import { RoutingRuleEntity } from "./entities/routingRule.entity";
import { RoutingTagEntity } from "./entities/routingTag.entity";
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

export const databaseEntities = [
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
    DimseAllowedRemoteEntity,
    EventLogEntity,
    RoutingDestinationEntity,
    RoutingTagEntity,
    RoutingRuleEntity,
    RoutingJobEntity,
];

export function buildMigratedDataSourceOptions(
    configOrString: DataSourceOptions | string,
    overrides: Partial<DataSourceOptions> = {},
): DataSourceOptions {
    return {
        ...parseDataSourceConfig(configOrString),
        entities: databaseEntities,
        subscribers: [SeriesSubscriber],
        migrations,
        migrationsRun: true,
        migrationsTableName: "typeorm_migrations",
        migrationsTransactionMode: "all",
        ...overrides,
    } as DataSourceOptions;
}
