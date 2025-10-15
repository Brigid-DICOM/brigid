import { AccountEntity } from "@brigid/database/src/entities/account.entity";
import { DicomCodeSequenceEntity } from "@brigid/database/src/entities/dicomCodeSequence.entity";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import { PersonNameEntity } from "@brigid/database/src/entities/personName.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { SessionEntity } from "@brigid/database/src/entities/session.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { VerificationTokenEntity } from "@brigid/database/src/entities/verificationToken.entity";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import * as SqliteDriver from "sqlite3";
import { DataSource } from "typeorm";

export class TestDatabaseManager {
    public dataSource: DataSource;
    private isInitialized: boolean = false;

    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
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
                DicomCodeSequenceEntity
            ],
            synchronize: true,
            logging: false,
            driver: SqliteDriver
        });
    }

    async initialize() {
        if (!this.isInitialized) {
            await this.dataSource.initialize();
            this.isInitialized = true;
        }
    }

    async cleanup() {
        if (this.isInitialized) {
            await this.dataSource.destroy();
            this.isInitialized = false;
        }
    }

    async clearDatabase() {
        await this.dataSource.manager.clear(InstanceEntity);
        await this.dataSource.manager.clear(SeriesEntity);
        await this.dataSource.manager.clear(StudyEntity);
        await this.dataSource.manager.clear(WorkspaceEntity);
    }

    async getStudies(workspaceId: string) {
        return await this.dataSource.manager.find(StudyEntity, {
            where: {
                workspaceId: workspaceId
            }
        });
    }

    async getSeries(workspaceId: string) {
        return await this.dataSource.manager.find(SeriesEntity, {
            where: {
                workspaceId: workspaceId
            }
        });
    }

    async getInstances(workspaceId: string) {
        return await this.dataSource.manager.find(InstanceEntity, {
            where: {
                workspaceId: workspaceId
            }
        });
    }
}