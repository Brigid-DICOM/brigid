import { AppDataSource } from "@brigid/database";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import { appLogger } from "@/server/utils/logger";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";
import { DicomDeleteService } from "./dicomDelete.service";
import env from "@brigid/env";
import { setTimeout } from "timers/promises";

const logger = appLogger.child({
    module: "DicomCleanupSchedulerService"
});

export class DicomCleanupSchedulerService {
    private deleteService: DicomDeleteService;
    private intervalId: NodeJS.Timeout | null = null;
    private isRunning: boolean = false;
    private static readonly DEFAULT_BATCH_SIZE = 500;
    private static readonly SHUTDOWN_TIMEOUT_MS = 30000;
    private static readonly SHUTDOWN_CHECK_INTERVAL_MS = 100;

    constructor() {
        this.deleteService = new DicomDeleteService();
    }

    start(intervalMs?: number) {
        if (this.intervalId) {
            logger.warn("Dicom cleanup scheduler already started");
            return;
        }

        const interval = intervalMs ?? (env.DICOM_CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);

        logger.info(`Starting dicom cleanup scheduler with interval ${interval}ms (${env.DICOM_CLEANUP_INTERVAL_HOURS} hours)`);

        this.runCleanup();

        this.intervalId = setInterval(() => {
            this.runCleanup();
        }, interval);
    }

    async stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            logger.info("Dicom cleanup scheduler stopped");
        }

        if (this.isRunning) {
            logger.info("Waiting for current cleanup to complete...");

            const maxWaitTime = DicomCleanupSchedulerService.SHUTDOWN_TIMEOUT_MS;
            const startTime = Date.now();

            while(this.isRunning && Date.now() - startTime < maxWaitTime) {
                await setTimeout(DicomCleanupSchedulerService.SHUTDOWN_CHECK_INTERVAL_MS);
            }

            if (this.isRunning) {
                logger.warn("Cleanup did not complete within timeout, forcing stop");
            } else {
                logger.info("Cleanup completed successfully");
            }
        }
    }

    private async runCleanup() {

        if (this.isRunning) {
            logger.warn("Previous cleanup is still running, skipping current cleanup");
            return;
        }

        this.isRunning = true;

        try {
            logger.info("Starting dicom cleanup");

            const retentionDays = env.DICOM_CLEANUP_RETENTION_DAYS;
            const retentionDate = new Date();
            retentionDate.setDate(retentionDate.getDate() - retentionDays);

            logger.info(`Cleaning up items deleted before ${retentionDate.toISOString()} (${env.DICOM_CLEANUP_RETENTION_DAYS} days ago)`);

            for await (const workspaceId of this.getAllWorkspaceIdsGenerator()) {
                const result = await this.deleteService.permanentlyDeleteMarkedItems(workspaceId, retentionDate);

                if (result.deletedInstances > 0) {
                    logger.info(
                        `Workspace ${workspaceId} permanently deleted ${result.deletedInstances} instances`
                    );

                    await this.deletePhysicalFiles(result.instancePaths);
                }
            }

            logger.info("Dicom cleanup completed");
        } catch (error) {
            logger.error("Failed to cleanup dicom", error);
        } finally {
            this.isRunning = false;
        }
    }

    private async *getAllWorkspaceIdsGenerator(batchSize: number = DicomCleanupSchedulerService.DEFAULT_BATCH_SIZE): AsyncGenerator<string> {
        const workspaceRepo = AppDataSource.getRepository(WorkspaceEntity);

        let offset = 0;

        while(true) {
            try {
                const batch = await workspaceRepo.find({
                    skip: offset,
                    take: batchSize,
                    order: {
                        id: "ASC",
                    },
                    select: {
                        id: true
                    }
                });
    
                if (batch.length === 0) break;
    
                for (const w of batch) {
                    yield w.id;
                }
    
                offset += batchSize;
            } catch(error) {
                logger.error(`Failed to get workspace batch at offset ${offset}`, error);
                break;
            }
        }
    }

    private async deletePhysicalFiles(filePaths: string[]) {
        if (filePaths.length === 0) return;

        try {
            logger.info(`Deleting physical files: ${filePaths.join(", ")}`);

            const storageProvider = getStorageProvider();

            await storageProvider.deleteFiles(filePaths);

            logger.info(`Deleted ${filePaths.length} physical files`);
        } catch(error) {
            logger.error(`Failed to delete physical files: ${error}`, {
                fileCount: filePaths.length,
                firstFewFiles: filePaths.slice(0, 5),
                error: error instanceof Error ? error.message : String(error)
            })
        }
    }
}