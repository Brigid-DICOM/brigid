import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import type { DataSource } from "typeorm";
import { RoutingDestinationEntity } from "@brigid/database/src/entities/routingDestination.entity";
import { RoutingJobEntity } from "@brigid/database/src/entities/routingJob.entity";
import { RoutingRuleEntity } from "@brigid/database/src/entities/routingRule.entity";
import { RoutingJobService } from "@/server/routing/jobService";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("RoutingJobService", () => {
    let testDb: TestDatabaseManager;
    let service: RoutingJobService;
    let destinationId: string;
    let ruleId: string;

    beforeAll(async () => {
        testDb = new TestDatabaseManager();
        await testDb.initialize();
        global.setTestDataSource(testDb.dataSource);
        service = new RoutingJobService();
    });

    afterAll(async () => {
        await testDb.cleanup();
    });

    beforeEach(async () => {
        await testDb.clearDatabase();
        await testDb.seedTestData();

        const destination = await testDb.dataSource
            .getRepository(RoutingDestinationEntity)
            .save({
                workspaceId: WORKSPACE_ID,
                name: "Dest",
                type: "dimse",
                enabled: true,
                aeTitle: "DEST",
                host: "127.0.0.1",
                port: 11112,
            });
        destinationId = destination.id;

        const rule = await testDb.dataSource
            .getRepository(RoutingRuleEntity)
            .save({
                workspaceId: WORKSPACE_ID,
                name: "CT rule",
                enabled: true,
                priority: 10,
                destinationId,
                delaySeconds: 30,
                conditions: [
                    { tag: "Modality", operator: "equals", value: "CT" },
                ],
            });
        ruleId = rule.id;
    });

    it("creates scheduled job on first hit with delay", async () => {
        const now = new Date("2026-01-01T00:00:00.000Z");
        const [job] = await service.createOrUpdateJobsFromMatchedRules(
            {
                workspaceId: WORKSPACE_ID,
                dicomJson: {},
                studyInstanceUid: "1.2.study",
                seriesInstanceUid: "1.2.series",
                sopInstanceUid: "1.2.sop",
                now,
            },
            [{ id: ruleId, destinationId, delaySeconds: 30 }],
        );

        expect(job.status).toBe("scheduled");
        expect(job.scheduledAt.toISOString()).toBe(
            "2026-01-01T00:00:30.000Z",
        );
        expect(job.attempt).toBe(0);
    });

    it("rebuilds non-sending job on repeat ingest", async () => {
        const repo = testDb.dataSource.getRepository(RoutingJobEntity);
        await repo.save({
            workspaceId: WORKSPACE_ID,
            ruleId,
            destinationId,
            sopInstanceUid: "1.2.sop",
            studyInstanceUid: "1.2.study",
            seriesInstanceUid: "1.2.series",
            status: "failed",
            scheduledAt: new Date("2026-01-01T00:00:00.000Z"),
            attempt: 3,
            lastError: "boom",
            pendingRebuild: false,
        });

        const now = new Date("2026-01-02T00:00:00.000Z");
        const [job] = await service.createOrUpdateJobsFromMatchedRules(
            {
                workspaceId: WORKSPACE_ID,
                dicomJson: {},
                studyInstanceUid: "1.2.study",
                seriesInstanceUid: "1.2.series",
                sopInstanceUid: "1.2.sop",
                now,
            },
            [{ id: ruleId, destinationId, delaySeconds: 10 }],
        );

        expect(job.status).toBe("scheduled");
        expect(job.attempt).toBe(0);
        expect(job.lastError).toBeNull();
        expect(job.scheduledAt.toISOString()).toBe(
            "2026-01-02T00:00:10.000Z",
        );
    });

    it("sets pendingRebuild when job is sending", async () => {
        const repo = testDb.dataSource.getRepository(RoutingJobEntity);
        await repo.save({
            workspaceId: WORKSPACE_ID,
            ruleId,
            destinationId,
            sopInstanceUid: "1.2.sop",
            studyInstanceUid: "1.2.study",
            seriesInstanceUid: "1.2.series",
            status: "sending",
            scheduledAt: new Date(),
            attempt: 1,
            pendingRebuild: false,
        });

        const [job] = await service.createOrUpdateJobsFromMatchedRules(
            {
                workspaceId: WORKSPACE_ID,
                dicomJson: {},
                studyInstanceUid: "1.2.study",
                seriesInstanceUid: "1.2.series",
                sopInstanceUid: "1.2.sop",
            },
            [{ id: ruleId, destinationId, delaySeconds: 0 }],
        );

        expect(job.status).toBe("sending");
        expect(job.pendingRebuild).toBe(true);
    });

    it("rebuilds after send completes when pendingRebuild", async () => {
        const repo = testDb.dataSource.getRepository(RoutingJobEntity);
        const job = await repo.save({
            workspaceId: WORKSPACE_ID,
            ruleId,
            destinationId,
            sopInstanceUid: "1.2.sop",
            studyInstanceUid: "1.2.study",
            seriesInstanceUid: "1.2.series",
            status: "sending",
            scheduledAt: new Date(),
            attempt: 2,
            pendingRebuild: true,
        });

        const before = Date.now();
        const rebuilt = await service.markSucceeded(job);
        expect(rebuilt.status).toBe("scheduled");
        expect(rebuilt.pendingRebuild).toBe(false);
        expect(rebuilt.attempt).toBe(0);
        // rule delaySeconds is 30
        expect(
            rebuilt.scheduledAt.getTime() - before,
        ).toBeGreaterThanOrEqual(29_000);
        expect(
            rebuilt.scheduledAt.getTime() - before,
        ).toBeLessThanOrEqual(35_000);
    });

    it("sendNow bypasses delay for scheduled jobs", async () => {
        const repo = testDb.dataSource.getRepository(RoutingJobEntity);
        const job = await repo.save({
            workspaceId: WORKSPACE_ID,
            ruleId,
            destinationId,
            sopInstanceUid: "1.2.sop",
            studyInstanceUid: "1.2.study",
            seriesInstanceUid: "1.2.series",
            status: "scheduled",
            scheduledAt: new Date("2030-01-01T00:00:00.000Z"),
            attempt: 0,
            pendingRebuild: false,
        });

        const now = new Date("2026-06-01T12:00:00.000Z");
        const updated = await service.sendNow(job.id, WORKSPACE_ID, now);
        expect(updated.scheduledAt.toISOString()).toBe(
            "2026-06-01T12:00:00.000Z",
        );
    });

    it("retry resets failed job to scheduled without clearing attempt", async () => {
        const repo = testDb.dataSource.getRepository(RoutingJobEntity);
        const job = await repo.save({
            workspaceId: WORKSPACE_ID,
            ruleId,
            destinationId,
            sopInstanceUid: "1.2.sop",
            studyInstanceUid: "1.2.study",
            seriesInstanceUid: "1.2.series",
            status: "failed",
            scheduledAt: new Date("2026-01-01T00:00:00.000Z"),
            attempt: 4,
            lastError: "network",
            pendingRebuild: false,
        });

        const now = new Date("2026-06-01T12:00:00.000Z");
        const updated = await service.retry(job.id, WORKSPACE_ID, now);
        expect(updated.status).toBe("scheduled");
        expect(updated.attempt).toBe(4);
        expect(updated.lastError).toBeNull();
        expect(updated.scheduledAt.toISOString()).toBe(
            "2026-06-01T12:00:00.000Z",
        );
    });
});
