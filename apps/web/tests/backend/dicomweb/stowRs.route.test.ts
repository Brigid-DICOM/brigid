import { createReadStream } from "node:fs";
import path from "node:path";
import { afterEach, beforeEach } from "node:test";
import fsE from "fs-extra";
import { testClient } from "hono/testing";
import { DataSource } from "typeorm";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { app } from "@/app/api/[...route]/route";
import stowRsRoute from "@/server/routes/workspaces/stow-rs/stowRs.route";
import multipartMessage from "@/server/utils/multipartMessage";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("STOW-RS Route", () => {
    let testDb: TestDatabaseManager;

    beforeAll(async () => {
        testDb = new TestDatabaseManager();
        await testDb.initialize();

        global.setTestDataSource(testDb.dataSource);
    });

    afterAll(async () => {
        await testDb.cleanup();
        await fsE.remove(
            path.resolve(__dirname, "../../fixtures/dicomFiles/temp/dicom")
        );
    });

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        await testDb.clearDatabase();
    });

    describe("POST /workspaces/:workspaceId/studies", () => {
        it("should store single DICOM file successfully", async () => {
            // Arrange
            const { data, boundary } = multipartMessage.multipartEncodeByStream(
                [
                    {
                        stream: createReadStream(
                            path.resolve(
                                __dirname,
                                "../../fixtures/dicomFiles/1-01-mod-vo"
                            )
                        ),
                        contentLocation: "1-01-mod-vo"
                    }
                ],
                undefined, // default to use guid boundary
                "application/dicom"
            );
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies`,
                {
                    method: "POST",
                    //@ts-expect-error
                    body: data,
                    headers: new Headers({
                        "Content-Type": `multipart/related; boundary=${boundary}`
                    }),
                    duplex: "half"
                }
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveProperty("00081190");
            expect(json).toHaveProperty("00081198");
            expect(json).toHaveProperty("00081199");
            expect(json).toHaveProperty("0008119A");
            expect(json["00081190"].Value).toHaveLength(1);
            expect(json["00081199"].Value).toHaveLength(1);
            expect(json["0008119A"].Value).toHaveLength(0);
        });

        it("should return 404 for non-existent workspace", async () => {
            // Arrange
            const { data, boundary } = multipartMessage.multipartEncodeByStream(
                [
                    {
                        stream: createReadStream(
                            path.resolve(
                                __dirname,
                                "../../fixtures/dicomFiles/1-01-mod-vo"
                            )
                        ),
                        contentLocation: "1-01-mod-vo"
                    }
                ],
                undefined, // default to use guid boundary
                "application/dicom"
            );
            const nonExistentWorkspaceId = "non-existent-workspace-id";

            // Act
            const response = await app.request(
                `/api/workspaces/${nonExistentWorkspaceId}/studies`,
                {
                    method: "POST",
                    //@ts-expect-error
                    body: data,
                    headers: new Headers({
                        "Content-Type": `multipart/related; boundary=${boundary}`
                    }),
                    duplex: "half"
                }
            );

            // Assert
            expect(response.status).toBe(404);
        });

        it("should handle file upload errors gracefully", async () => {
            const { StowRsService } = await import("@/server/services/stowRs.service");
            vi.spyOn(StowRsService.prototype, "storeDicomFiles")
                .mockRejectedValue(new Error("File upload error"));
            // Arrange
            const { data, boundary } = multipartMessage.multipartEncodeByStream(
                [
                    {
                        stream: createReadStream(
                            path.resolve(
                                __dirname,
                                "../../fixtures/dicomFiles/1-01-mod-vo"
                            )
                        ),
                        contentLocation: "1-01-mod-vo"
                    }
                ],
                undefined, // default to use guid boundary
                "application/dicom"
            );
    
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies`,
                {
                    method: "POST",
                    //@ts-expect-error
                    body: data,
                    headers: new Headers({
                        "Content-Type": `multipart/related; boundary=${boundary}`
                    }),
                    duplex: "half"
                }
            );
    
            // Assert
            expect(response.status).toBe(500);
        });
    });
});
