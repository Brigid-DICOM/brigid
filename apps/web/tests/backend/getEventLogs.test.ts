import { EventLogEntity } from "@brigid/database/src/entities/eventLog.entity";
import type { DataSource } from "typeorm";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import { app } from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../utils/testDatabaseManager";
import { WORKSPACE_ID } from "./workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Event Logs API", () => {
    let testDb: TestDatabaseManager;

    beforeAll(async () => {
        testDb = new TestDatabaseManager();
        await testDb.initialize();
        (global as any).setTestDataSource(testDb.dataSource);
    });

    afterAll(async () => {
        await testDb.cleanup();
    });

    beforeEach(async () => {
        vi.clearAllMocks();
        await testDb.clearDatabase();
        await testDb.dataSource.getRepository(EventLogEntity).clear();
    });

    async function seedLogs() {
        const repo = testDb.dataSource.getRepository(EventLogEntity);
        const now = new Date();

        const logs = repo.create([
            {
                name: "API_START",
                level: "info",
                message: "Request started",
                workspaceId: WORKSPACE_ID,
                requestId: "req-1",
                createdAt: new Date(now.getTime() - 5000),
            },
            {
                name: "API_END",
                level: "info",
                message: "Request ended",
                workspaceId: WORKSPACE_ID,
                requestId: "req-1",
                elapsedTime: 200,
                createdAt: new Date(now.getTime() - 4800),
            },
            {
                name: "ERROR_LOG",
                level: "error",
                message: "Something went wrong",
                workspaceId: WORKSPACE_ID,
                requestId: "req-2",
                createdAt: new Date(now.getTime() - 1000),
            },
            {
                name: "OTHER_WORKSPACE",
                level: "info",
                message: "Log from another workspace",
                workspaceId: "other-workspace-id",
                createdAt: now,
            }
        ]);
        await repo.save(logs);
    }

    it("should return all event logs for a workspace", async () => {
        await seedLogs();

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/event-logs`,
            { method: "GET" }
        );

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.eventLogs).toHaveLength(3); // 排除其他 workspace 的 logs
    });

    it("should filter logs by level", async () => {
        await seedLogs();

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/event-logs?level=error`,
            { method: "GET" }
        );

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.eventLogs).toHaveLength(1);
        expect(json.data.eventLogs[0].name).toBe("ERROR_LOG");
    });

    it("should filter logs by name", async () => {
        await seedLogs();

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/event-logs?name=API_END`,
            { method: "GET" }
        );
        
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.eventLogs).toHaveLength(1);
        expect(json.data.eventLogs[0].name).toBe("API_END");
    });

    it("should filter logs by date range", async () => {
        await seedLogs();

        const now = new Date();
        const startDate = (new Date(now.getTime() - 2000)).toISOString();

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/event-logs?startDate=${startDate}`,
            { method: "GET" }
        );

        const json = await response.json();
        expect(json.data.eventLogs).toHaveLength(1);
    });

    it("should support pagination", async () => {
        await seedLogs();

        const response = await app.request(
            `/api/workspaces/${WORKSPACE_ID}/event-logs?limit=1&offset=1`,
            { method: "GET" }
        );

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.ok).toBe(true);
        expect(json.data.eventLogs).toHaveLength(1);
        expect(json.data.hasNextPage).toBe(true);
    });

    it("should return 404 when workspace does not exist", async () => {
        const nonExistentWorkspaceId = "non-existent-workspace-id";

        const response = await app.request(
            `/api/workspaces/${nonExistentWorkspaceId}/event-logs`,
            { method: "GET" }
        );

        expect(response.status).toBe(404);
    });
});