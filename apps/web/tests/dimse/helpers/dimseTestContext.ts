import path from "node:path";
import { AppDataSource, initializeDb } from "@brigid/database";
import { DimseConfigEntity } from "@brigid/database/src/entities/dimseConfig.entity";
import env from "@brigid/env";
import fsE from "fs-extra";
import {
    afterAll,
    beforeAll,
    beforeEach,
} from "vitest";
import { DimseApp } from "@/server/dimse";
import { WorkspaceService } from "@/server/services/workspace.service";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import {
    assertDcmtkInstalled,
    runEchoscu,
} from "./dcmsendRunner";
import { getStorageLocalDir } from "./storage";

let testDb: TestDatabaseManager;
let dimseApp: DimseApp;
let preserveDicomDataDepth = 0;

export function preserveDicomDataForSuite(): void {
    preserveDicomDataDepth++;
}

export function releaseDicomDataPreservation(): void {
    preserveDicomDataDepth = Math.max(0, preserveDicomDataDepth - 1);
}

export function useDimseTestContext(): void {
    beforeAll(async () => {
        assertDcmtkInstalled();

        await initializeDb();

        testDb = new TestDatabaseManager();
        await testDb.initialize();

        const workspaceService = new WorkspaceService();
        const workspace = await workspaceService.getOrCreateSystemWorkspace();

        const aeTitle = process.env.TEST_DIMSE_AE_TITLE ?? "BRIGID_TEST";
        const existingConfig = await AppDataSource.manager.findOne(
            DimseConfigEntity,
            { where: { aeTitle } },
        );

        if (!existingConfig) {
            await AppDataSource.manager.save(DimseConfigEntity, {
                workspaceId: workspace.id,
                aeTitle,
                enabled: true,
            });
        }

        const host =
            process.env.TEST_DIMSE_HOST ?? env.DIMSE_HOSTNAME ?? "127.0.0.1";
        const port = Number(process.env.TEST_DIMSE_PORT ?? env.DIMSE_PORT);

        dimseApp = DimseApp.getInstance(host, port);
        await dimseApp.start();

        const echo = runEchoscu();
        if (echo.exitCode !== 0) {
            throw new Error(
                `DIMSE C-ECHO warmup failed (exit ${echo.exitCode}): ${echo.stderr}`,
            );
        }
    });

    beforeEach(async () => {
        if (preserveDicomDataDepth > 0) {
            return;
        }

        await testDb.clearDicomData();
        await clearTestStorage();
    });
    
    afterAll(async () => {
        dimseApp?.stop();
        DimseApp.resetInstance();

        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }
        
        await testDb?.cleanup();
    });
}

async function clearTestStorage(): Promise<void> {
    const dicomDir = path.join(getStorageLocalDir(), "dicom");
    await fsE.ensureDir(dicomDir);
    await fsE.emptyDir(dicomDir);
}
