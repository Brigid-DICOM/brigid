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

describe("DIMSE Routes", () => {
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

    describe("GET /workspace/:workspaceId/dimse - Get DIMSE Config", () => {
        it("should return null when no config exists", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "GET" },
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeNull();
        });

        it("should return config with allowed IPs and remotes", async () => {
            // Arrange: Create config first
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                    enabled: true,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "GET" },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data.aeTitle).toBe("BRIGID_TEST");
            expect(json.data.enabled).toBe(true);
            expect(json.data.allowedIps).toEqual([]);
            expect(json.data.allowedRemotes).toEqual([]);
        });
    });

    describe("POST /workspace/:workspaceId/dimse - Create DIMSE Config", () => {
        it("should create a new DIMSE config successfully", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "BRIGID_TEST",
                        enabled: false,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data).toBeDefined();
            expect(json.data.aeTitle).toBe("BRIGID_TEST");
            expect(json.data.enabled).toBe(false);
            expect(json.data.workspaceId).toBe(WORKSPACE_ID);
        });

        it("should reject invalid AE Title format", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "invalid-lowercase",
                        enabled: false,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(400);
        });

        it("should reject AE Title longer than 16 characters", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "THISISATITLETOOLONGFORTHED",
                        enabled: false,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(400);
        });

        it("should reject duplicate config for same workspace", async () => {
            // Arrange: Create first config
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                    enabled: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act: Try to create another config
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "BRIGID_TEST2",
                        enabled: true,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(409);
            const json = await response.json();
            expect(json.ok).toBe(false);
        });
    });

    describe("PATCH /workspace/:workspaceId/dimse - Update DIMSE Config", () => {
        it("should update AE Title successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "ORIGINAL",
                    enabled: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        aeTitle: "UPDATED",
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
            expect(json.data.aeTitle).toBe("UPDATED");
            expect(json.data.enabled).toBe(false);
        });

        it("should update enabled status successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                    enabled: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        enabled: true,
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
            expect(json.data.enabled).toBe(true);
        });

        it("should return 404 when config not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        aeTitle: "UPDATED",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /workspaces/:workspaceId/dimse - Delete DIMSE Config", () => {
        it("should delete config successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                    enabled: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "DELETE" },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);

            // Verify it's deleted
            const getResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "GET" },
            );
            const getJson = await getResponse.json();
            expect(getJson.data).toBeNull();
        });

        it("should return 404 when config not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "DELETE" },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("POST /workspaces/:workspaceId/dimse/allowed-ips - Add Allowed IP", () => {
        it("should add allowed IP successfully", async () => {
            // Arrange: Create config first
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                    enabled: false,
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "192.168.1.0/24",
                        description: "Local network",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.ipMask).toBe("192.168.1.0/24");
            expect(json.data.description).toBe("Local network");
        });

        it("should add single IP address successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "10.0.0.1",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.data.ipMask).toBe("10.0.0.1");
        });

        it("should reject invalid IP format", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "invalid-ip",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(400);
        });

        it("should return 404 when config not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "192.168.1.0/24",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /workspaces/:workspaceId/dimse/allowed-ips/:allowedIpId - Remove Allowed IP", () => {
        it("should remove allowed IP successfully", async () => {
            // Arrange: Create config and add IP
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            const addResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "192.168.1.0/24",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const addedIp = await addResponse.json();
            const ipId = addedIp.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips/${ipId}`,
                { method: "DELETE" },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });

        it("should return 404 when IP not found", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips/00000000-0000-0000-0000-000000000000`,
                { method: "DELETE" },
            );

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe("POST /workspaces/:workspaceId/dimse/allowed-remotes - Add Allowed Remote", () => {
        it("should add allowed remote successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "REMOTE_AE",
                        host: "192.168.1.100",
                        port: 11112,
                        description: "Remote PACS",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(201);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.aeTitle).toBe("REMOTE_AE");
            expect(json.data.host).toBe("192.168.1.100");
            expect(json.data.port).toBe(11112);
            expect(json.data.description).toBe("Remote PACS");
        });

        it("should reject invalid port number", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "REMOTE_AE",
                        host: "192.168.1.100",
                        port: 70000,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(400);
        });

        it("should reject invalid host format", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "REMOTE_AE",
                        host: "invalid-host",
                        port: 11112,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(400);
        });

        it("should return 404 when config not found", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "REMOTE_AE",
                        host: "192.168.1.100",
                        port: 11112,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            expect(response.status).toBe(404);
        });
    });

    describe("PATCH /workspaces/:workspaceId/dimse/allowed-remotes/:remoteId - Update Allowed Remote", () => {
        it("should update remote AE Title successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            const addResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "ORIGINAL_AE",
                        host: "192.168.1.100",
                        port: 11112,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const addedRemote = await addResponse.json();
            const remoteId = addedRemote.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes/${remoteId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        aeTitle: "UPDATED_AE",
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
            expect(json.data.aeTitle).toBe("UPDATED_AE");
            expect(json.data.host).toBe("192.168.1.100");
            expect(json.data.port).toBe(11112);
        });

        it("should update multiple fields successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            const addResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "ORIGINAL_AE",
                        host: "192.168.1.100",
                        port: 11112,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const addedRemote = await addResponse.json();
            const remoteId = addedRemote.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes/${remoteId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        aeTitle: "NEW_AE",
                        host: "10.0.0.1",
                        port: 104,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.data.aeTitle).toBe("NEW_AE");
            expect(json.data.host).toBe("10.0.0.1");
            expect(json.data.port).toBe(104);
        });

        it("should return 404 when remote not found", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes/00000000-0000-0000-0000-000000000000`,
                {
                    method: "PATCH",
                    body: JSON.stringify({
                        aeTitle: "UPDATED_AE",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe("DELETE /workspaces/:workspaceId/dimse/allowed-remotes/:remoteId - Remove Allowed Remote", () => {
        it("should remove remote successfully", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            const addResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "REMOTE_AE",
                        host: "192.168.1.100",
                        port: 11112,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            const addedRemote = await addResponse.json();
            const remoteId = addedRemote.data.id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes/${remoteId}`,
                { method: "DELETE" },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });

        it("should return 404 when remote not found", async () => {
            // Arrange
            await app.request(`/api/workspaces/${WORKSPACE_ID}/dimse`, {
                method: "POST",
                body: JSON.stringify({
                    aeTitle: "BRIGID_TEST",
                }),
                headers: new Headers({
                    "Content-Type": "application/json",
                }),
            });

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes/00000000-0000-0000-0000-000000000000`,
                { method: "DELETE" },
            );

            // Assert
            expect(response.status).toBe(404);
        });
    });

    describe("Integration - Full DIMSE Config Flow", () => {
        it("should manage complete DIMSE configuration lifecycle", async () => {
            // 1. Create config
            const createResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "BRIGID_PACS",
                        enabled: true,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );
            expect(createResponse.status).toBe(201);

            // 2. Add multiple allowed IPs
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "192.168.1.0/24",
                        description: "Main network",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-ips`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ipMask: "10.0.0.0/8",
                        description: "Private network",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // 3. Add allowed remote
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse/allowed-remotes`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        aeTitle: "EXTERNAL_PACS",
                        host: "192.168.1.50",
                        port: 11112,
                        description: "External PACS server",
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // 4. Verify complete config
            const getResponse = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dimse`,
                { method: "GET" },
            );
            expect(getResponse.status).toBe(200);
            const config = await getResponse.json();

            expect(config.data.aeTitle).toBe("BRIGID_PACS");
            expect(config.data.enabled).toBe(true);
            expect(config.data.allowedIps).toHaveLength(2);
            expect(config.data.allowedRemotes).toHaveLength(1);
            expect(config.data.allowedRemotes[0].aeTitle).toBe("EXTERNAL_PACS");
        });
    });
});
