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
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Tags Routes", () => {
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
        vi.restoreAllMocks();
        await testDb.clearDatabase();
    });

    describe("POST /workspaces/:workspaceId/tags - Create Tag", () => {
        it("should create a new tag successfully", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Important",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data.name).toBe("Important");
            expect(json.data.color).toBe("#FF5733");
            expect(json.data.workspaceId).toBe(WORKSPACE_ID);
        });

        it("should reject invalid color format", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Important",
                        color: "invalid",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(400);
        });

        it("should reject empty tag name", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(400);
        });
    });

    describe("PATCH /workspaces/:workspaceId/tags/:tagId - Update Tag", () => {
        it("should update tag name successfully", async () => {
            // Arrange: Create a tag
            const createResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Original",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdTag = await createResponse.json();
            const tagId = createdTag.data.id;

            // Act: update the tag name
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/${tagId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: "Updated",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert: Check the response
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data.name).toBe("Updated");
            expect(json.data.color).toBe("#FF5733");
        });

        it("should update tag color successfully", async () => {
            // Arrange: Create a tag
            const createResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Original",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            const createdTag = await createResponse.json();
            const tagId = createdTag.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/${tagId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        color: "#000000",
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
            expect(json.data).toBeDefined();
            expect(json.data.color).toBe("#000000");
            expect(json.data.name).toBe("Original");
        });

        it("should update both name and color successfully", async () => {
            // Arrange: Create a tag
            const createResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Original",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdTag = await createResponse.json();
            const tagId = createdTag.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/${tagId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: "Updated",
                        color: "#000000",
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
            expect(json.data).toBeDefined();
            expect(json.data.name).toBe("Updated");
            expect(json.data.color).toBe("#000000");
        });

        it("should return 404 if tag not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/non-existent-tag-id`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        name: "Updated",
                    }),
                },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /workspaces/:workspaceId/tags/:tagId - Delete Tag", () => {
        it("should delete a tag successfully", async () => {
            // Arrange: Create a tag
            const createResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "Original",
                        color: "#FF5733",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const createdTag = await createResponse.json();
            const tagId = createdTag.data.id;

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/${tagId}`,
                {
                    method: "DELETE",
                },
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });

        it("should return 404 if tag not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/non-existent-tag-id`,
                {
                    method: "DELETE",
                },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("GET /workspaces/:workspaceId/tags - Get All Tags", () => {
        it("should return all empty array when no tags exist", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data).toEqual([]);
        });

        it("should return all tags in workspace", async () => {
            // Arrange: Create some tags
            await app.request(`/api/workspaces/${WORKSPACE_ID}/tags`, {
                method: "POST",
                body: JSON.stringify({
                    name: "Tag 1",
                    color: "#FF5733",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });
            await app.request(`/api/workspaces/${WORKSPACE_ID}/tags`, {
                method: "POST",
                body: JSON.stringify({
                    name: "Tag 2",
                    color: "#00FF00",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags`,
                {
                    method: "GET",
                },
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data).toHaveLength(2);
            expect(json.data[0].name).toBe("Tag 1");
            expect(json.data[1].name).toBe("Tag 2");
        });
    });
});
