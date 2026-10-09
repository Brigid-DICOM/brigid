import type { DataSource } from "typeorm";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from "vitest";
import { RoutingDestinationEntity } from "@brigid/database/src/entities/routingDestination.entity";
import { RoutingJobEntity } from "@brigid/database/src/entities/routingJob.entity";
import { RoutingRuleEntity } from "@brigid/database/src/entities/routingRule.entity";
import { app } from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Routing Routes", () => {
    let testDb: TestDatabaseManager;

    beforeAll(async () => {
        testDb = new TestDatabaseManager();
        await testDb.initialize();
        global.setTestDataSource(testDb.dataSource);
    });

    afterAll(async () => {
        await testDb.cleanup();
    });

    beforeEach(async () => {
        vi.clearAllMocks();
        await testDb.clearDatabase();
        await testDb.seedTestData();
    });

    it("creates a DIMSE destination", async () => {
        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/routing/destinations`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "PACS-A",
                    type: "dimse",
                    aeTitle: "PACSA",
                    host: "10.0.0.5",
                    port: 104,
                }),
            },
        );

        expect(response.status).toBe(201);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.name).toBe("PACS-A");
        expect(json.data.type).toBe("dimse");
        expect(json.data.hasAuthSecret).toBe(false);
    });

    it("creates a rule against a destination", async () => {
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

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/routing/rules`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: "CT to Dest",
                    destinationId: destination.id,
                    priority: 10,
                    delaySeconds: 5,
                    conditions: [
                        { tag: "Modality", operator: "equals", value: "CT" },
                    ],
                }),
            },
        );

        expect(response.status).toBe(201);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.name).toBe("CT to Dest");
    });

    it("lists jobs and supports send-now / retry", async () => {
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
        const rule = await testDb.dataSource
            .getRepository(RoutingRuleEntity)
            .save({
                workspaceId: WORKSPACE_ID,
                name: "Rule",
                enabled: true,
                priority: 1,
                destinationId: destination.id,
                delaySeconds: 60,
                conditions: [
                    { tag: "Modality", operator: "equals", value: "CT" },
                ],
            });

        const scheduledJob = await testDb.dataSource
            .getRepository(RoutingJobEntity)
            .save({
                workspaceId: WORKSPACE_ID,
                ruleId: rule.id,
                destinationId: destination.id,
                sopInstanceUid: "1.2.3",
                studyInstanceUid: "1.2.1",
                seriesInstanceUid: "1.2.2",
                status: "scheduled",
                scheduledAt: new Date("2030-01-01T00:00:00.000Z"),
                attempt: 0,
                pendingRebuild: false,
            });

        const listResponse = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/routing/jobs`,
        );
        expect(listResponse.status).toBe(200);
        const listJson = await listResponse.json();
        expect(listJson.data.items.length).toBe(1);

        const sendNowResponse = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/routing/jobs/${scheduledJob.id}/send-now`,
            { method: "POST" },
        );
        expect(sendNowResponse.status).toBe(200);
        const sendNowJson = await sendNowResponse.json();
        expect(new Date(sendNowJson.data.scheduledAt).getTime()).toBeLessThan(
            new Date("2030-01-01T00:00:00.000Z").getTime(),
        );

        const failedJob = await testDb.dataSource
            .getRepository(RoutingJobEntity)
            .save({
                workspaceId: WORKSPACE_ID,
                ruleId: rule.id,
                destinationId: destination.id,
                sopInstanceUid: "1.2.9",
                studyInstanceUid: "1.2.1",
                seriesInstanceUid: "1.2.2",
                status: "failed",
                scheduledAt: new Date("2026-01-01T00:00:00.000Z"),
                attempt: 2,
                lastError: "boom",
                pendingRebuild: false,
            });

        const retryResponse = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/routing/jobs/${failedJob.id}/retry`,
            { method: "POST" },
        );
        expect(retryResponse.status).toBe(200);
        const retryJson = await retryResponse.json();
        expect(retryJson.data.status).toBe("scheduled");
        expect(retryJson.data.attempt).toBe(2);
        expect(retryJson.data.lastError).toBeNull();
    });
});
