import { AppDataSource } from "@brigid/database";
import { RoutingJobEntity } from "@brigid/database/src/entities/routingJob.entity";
import env from "@brigid/env";
import { LessThanOrEqual } from "typeorm";
import { appLogger } from "@/server/utils/logger";
import { RoutingJobService } from "./jobService";
import { executeRoutingJob } from "./outbound";

const logger = appLogger.child({
    module: "RoutingPoller",
});

export class RoutingJobPoller {
    private intervalId: NodeJS.Timeout | null = null;
    private isPolling = false;
    private readonly jobService = new RoutingJobService();

    start(
        intervalMs = env.ROUTING_POLLER_INTERVAL_MS,
        batchSize = env.ROUTING_POLLER_BATCH_SIZE,
    ) {
        if (this.intervalId) {
            logger.warn("Routing poller already started");
            return;
        }

        logger.info(
            `Starting routing poller with interval ${intervalMs}ms, batch size ${batchSize}`,
        );

        this.intervalId = setInterval(() => {
            this.poll(batchSize);
        }, intervalMs);
    }

    async stop(): Promise<void> {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            logger.info("Routing poller stopped");
        }

        const maxWaitTime = 30000;
        const checkIntervalMs = 100;
        const startTime = Date.now();
        while (this.isPolling && Date.now() - startTime < maxWaitTime) {
            await new Promise((resolve) => setTimeout(resolve, checkIntervalMs));
        }
    }

    async poll(batchSize = env.ROUTING_POLLER_BATCH_SIZE): Promise<void> {
        if (this.isPolling) {
            return;
        }

        this.isPolling = true;
        try {
            const jobs = await this.claimScheduledJobs(batchSize);
            for (const job of jobs) {
                await this.processJob(job);
            }
        } catch (error) {
            logger.error("Routing poller iteration failed", error);
        } finally {
            this.isPolling = false;
        }
    }

    private async claimScheduledJobs(
        batchSize: number,
    ): Promise<RoutingJobEntity[]> {
        const now = new Date();

        if (AppDataSource.options.type === "postgres") {
            return AppDataSource.transaction(async (manager) => {
                const jobs = await manager
                    .createQueryBuilder(RoutingJobEntity, "job")
                    .where("job.status = :status", { status: "scheduled" })
                    .andWhere("job.scheduledAt <= :now", { now })
                    .orderBy("job.scheduledAt", "ASC")
                    .limit(batchSize)
                    .setLock("pessimistic_write")
                    .setOnLocked("skip_locked")
                    .getMany();

                for (const job of jobs) {
                    job.status = "sending";
                    await manager.save(RoutingJobEntity, job);
                }

                return jobs;
            });
        }

        const repo = AppDataSource.getRepository(RoutingJobEntity);
        const candidates = await repo.find({
            where: { status: "scheduled", scheduledAt: LessThanOrEqual(now) },
            order: { scheduledAt: "ASC" },
            take: batchSize,
        });

        const claimed: RoutingJobEntity[] = [];
        for (const job of candidates) {
            job.status = "sending";
            claimed.push(await repo.save(job));
        }
        return claimed;
    }

    private async processJob(job: RoutingJobEntity): Promise<void> {
        try {
            const result = await executeRoutingJob(job);
            if (result.outcome === "succeeded") {
                await this.jobService.markSucceeded(job, result.warning);
            } else {
                await this.jobService.markFailed(job, result.error);
                logger.warn("Routing job failed", {
                    jobId: job.id,
                    error: result.error,
                });
            }
        } catch (error) {
            logger.error("Routing job execution threw unexpectedly", error, {
                jobId: job.id,
            });
            await this.jobService.markFailed(
                job,
                error instanceof Error ? error.message : String(error),
            );
        }
    }
}