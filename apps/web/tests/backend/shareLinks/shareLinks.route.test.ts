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
import { app } from "@/app/api/[...route]/route";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Share Links Routes", () => {
    let testDb: TestDatabaseManager;
    let workspaceId: string;
    let studyUid: string;

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
        vi.restoreAllMocks();
        await testDb.clearDatabase();

        const seedData = await testDb.seedTestData();
        workspaceId = seedData.workspace.id;
        studyUid = seedData.studies[0].studyInstanceUid;
    });

    describe("POST /workspaces/:workspaceId/share-links", () => {
        it("should create a share link successfully", async () => {
            const response = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        targetType: "study",
                        targetIds: [studyUid],
                        publicPermissions: SHARE_PERMISSIONS.READ,
                        requiredPassword: false,
                        description: "Test share link",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.token).toBeDefined();
            expect(json.data.id).toBeDefined();
        });

        it("should create a password protected share link", async () => {
            const response = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        targetType: "study",
                        targetIds: [studyUid],
                        publicPermissions: SHARE_PERMISSIONS.READ,
                        requiredPassword: true,
                        password: "testpassword",
                        description: "Test share link",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });
    });

    describe("GET /workspaces/:workspaceId/share-links", () => {
        it("should return all share links for the workspace", async () => {
            // Arrange: Create a share link first
            await app.request(`/api/workspaces/${workspaceId}/share-links`, {
                method: "POST",
                body: JSON.stringify({
                    targetType: "study",
                    targetIds: [studyUid],
                    publicPermissions: SHARE_PERMISSIONS.READ,
                    requiredPassword: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data).toHaveProperty("shareLinks");
            expect(json.data.shareLinks).toHaveLength(1);
            expect(json.data).toHaveProperty("hasNextPage");
            expect(json.data).toHaveProperty("total");
            expect(json.data).toHaveProperty("page");
            expect(json.data).toHaveProperty("limit");
        });
    });

    describe("PATCH /workspaces/:workspaceId/share-links/:shareLinkId", () => {
        it("should update share link permissions successfully", async () => {
            // Arrange
            const createResponse = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        targetType: "study",
                        targetIds: [studyUid],
                        publicPermissions: SHARE_PERMISSIONS.READ,
                        requiredPassword: false,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdShareLink = await createResponse.json();
            const shareLinkId = createdShareLink.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${workspaceId}/share-links/${shareLinkId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        publicPermissions: SHARE_PERMISSIONS.FULL,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });
    });

    describe("POST /share/:token/verify-password", () => {
        it("should verify the password successfully", async () => {
            // Arrange: Create a password protected share link
            const createResponse = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        targetType: "study",
                        targetIds: [studyUid],
                        publicPermissions: SHARE_PERMISSIONS.READ,
                        requiredPassword: true,
                        password: "mysecretpassword",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdLink = await createResponse.json();
            const token = createdLink.data.token;

            const response = await app.request(
                `/api/share/${token}/verify-password`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        password: "mysecretpassword",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.isValid).toBe(true);
        });

        it("should reject incorrect password", async () => {
            const createResponse = await app.request(
                `/api/workspaces/${workspaceId}/share-links`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        targetType: "study",
                        targetIds: [studyUid],
                        publicPermissions: SHARE_PERMISSIONS.READ,
                        requiredPassword: true,
                        password: "mysecretpassword",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdLink = await createResponse.json();
            const token = createdLink.data.token;

            const response = await app.request(
                `/api/share/${token}/verify-password`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        password: "wrongpassword",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(401);
            const json = await response.json();
            expect(json.ok).toBe(false);
            expect(json.error).toBe("Invalid password");
        });
    });
});
