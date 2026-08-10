import { AppDataSource } from "@brigid/database";
import { RoutingJobEntity } from "@brigid/database/src/entities/routingJob.entity";
import { RoutingRuleEntity } from "@brigid/database/src/entities/routingRule.entity";
import type { DicomTag } from "@brigid/types";
import {
    matchRoutingRules,
    type RoutingEvaluateContext,
} from "./ruleEngine";

export type CreateJobsFromIngestInput = {
    workspaceId: string;
    dicomJson: DicomTag;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
    context?: RoutingEvaluateContext;
    now?: Date;
};

function computeScheduledAt(delaySeconds: number, now: Date): Date {
    return new Date(now.getTime() + delaySeconds * 1000);
}

export class RoutingJobService {
    private get repo() {
        return AppDataSource.getRepository(RoutingJobEntity);
    }

    async createOrUpdateJobsFromMatchedRules(
        input: CreateJobsFromIngestInput,
        matchedRules: Pick<
            RoutingRuleEntity,
            "id" | "destinationId" | "delaySeconds"
        >[],
    ): Promise<RoutingJobEntity[]> {
        const now = input.now ?? new Date();
        const results: RoutingJobEntity[] = [];

        for (const rule of matchedRules) {
            const existing = await this.repo.findOne({
                where: {
                    workspaceId: input.workspaceId,
                    ruleId: rule.id,
                    sopInstanceUid: input.sopInstanceUid,
                },
            });

            if (existing?.status === "sending") {
                existing.pendingRebuild = true;
                results.push(await this.repo.save(existing));
                continue;
            }

            const scheduledAt = computeScheduledAt(rule.delaySeconds, now);

            if (existing) {
                existing.status = "scheduled";
                existing.scheduledAt = scheduledAt;
                existing.attempt = 0;
                existing.lastError = null;
                existing.warning = null;
                existing.pendingRebuild = false;
                existing.completedAt = null;
                existing.destinationId = rule.destinationId;
                existing.studyInstanceUid = input.studyInstanceUid;
                existing.seriesInstanceUid = input.seriesInstanceUid;
                results.push(await this.repo.save(existing));
                continue;
            }

            const created = this.repo.create({
                workspaceId: input.workspaceId,
                ruleId: rule.id,
                destinationId: rule.destinationId,
                sopInstanceUid: input.sopInstanceUid,
                studyInstanceUid: input.studyInstanceUid,
                seriesInstanceUid: input.seriesInstanceUid,
                status: "scheduled",
                scheduledAt,
                attempt: 0,
                pendingRebuild: false,
            });
            results.push(await this.repo.save(created));
        }

        return results;
    }

    async evaluateAndCreateJobs(
        input: CreateJobsFromIngestInput & {
            rules: Pick<
                RoutingRuleEntity,
                "id" | "enabled" | "priority" | "conditions" | "destinationId" | "delaySeconds"
            >[];
        },
    ): Promise<RoutingJobEntity[]> {
        const matched = matchRoutingRules({
            dicomJson: input.dicomJson,
            rules: input.rules,
            context: input.context,
        });

        return this.createOrUpdateJobsFromMatchedRules(
            input,
            matched.map((matchedRule) => {
                const full = input.rules.find((r) => r.id === matchedRule.id);
                if (!full) {
                    throw new Error(`Matched rule missing: ${matchedRule.id}`);
                }
                return {
                    id: full.id,
                    destinationId: full.destinationId,
                    delaySeconds: full.delaySeconds,
                };
            }),
        );
    }

    async sendNow(jobId: string, workspaceId: string, now = new Date()) {
        const job = await this.repo.findOne({
            where: { id: jobId, workspaceId },
        });
        if (!job) {
            throw new Error("Routing job not found");
        }
        if (job.status !== "scheduled") {
            throw new Error("Only scheduled jobs can be sent now");
        }
        job.scheduledAt = now;
        return this.repo.save(job);
    }

    async retry(jobId: string, workspaceId: string, now = new Date()) {
        const job = await this.repo.findOne({
            where: { id: jobId, workspaceId },
        });
        if (!job) {
            throw new Error("Routing job not found");
        }
        if (job.status !== "failed" && job.status !== "dead") {
            throw new Error("Only failed or dead jobs can be retried");
        }
        job.status = "scheduled";
        job.scheduledAt = now;
        job.lastError = null;
        job.completedAt = null;
        return this.repo.save(job);
    }

    async markSending(job: RoutingJobEntity) {
        job.status = "sending";
        return this.repo.save(job);
    }

    async markSucceeded(job: RoutingJobEntity, warning?: string | null) {
        job.status = "succeeded";
        job.warning = warning ?? null;
        job.lastError = null;
        job.completedAt = new Date();
        const saved = await this.repo.save(job);
        return this.rebuildIfPending(saved);
    }

    async markFailed(job: RoutingJobEntity, error: string) {
        job.status = "failed";
        job.lastError = error;
        job.attempt += 1;
        job.completedAt = new Date();
        const saved = await this.repo.save(job);
        return this.rebuildIfPending(saved);
    }

    private async rebuildIfPending(job: RoutingJobEntity) {
        if (!job.pendingRebuild) {
            return job;
        }

        const rule = await AppDataSource.getRepository(RoutingRuleEntity).findOne(
            { where: { id: job.ruleId } },
        );

        job.status = "scheduled";
        job.scheduledAt = computeScheduledAt(
            rule?.delaySeconds ?? 0,
            new Date(),
        );
        job.attempt = 0;
        job.lastError = null;
        job.warning = null;
        job.pendingRebuild = false;
        job.completedAt = null;
        return this.repo.save(job);
    }
}
