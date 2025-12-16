import path from "node:path";
import { join } from "desm";
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
import { multipartDecode } from "@/lib/dicomMultipartDecode";
import testData from "../../fixtures/dicomFiles/data.json";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { TestFileManager } from "../../utils/testFileManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

// 使用 data.json 中的真實資料
const TEST_STUDY_KEY =
    "1.3.6.1.4.1.14519.5.2.1.3023.4017.246199836259881483055596634768";
const TEST_STUDY = testData[TEST_STUDY_KEY];
const TEST_SERIES = TEST_STUDY.series[0];
const TEST_INSTANCE_1 = TEST_SERIES.instances[0];
const TEST_INSTANCE_2 = TEST_SERIES.instances[1];

const TEST_DICOM_DATA = {
    studyInstanceUid: TEST_STUDY_KEY,
    seriesInstanceUid: TEST_SERIES.seriesInstanceUid,
    instances: [
        {
            sopInstanceUid: TEST_INSTANCE_1.sopInstanceUid,
            instanceFile: path.resolve(
                join(
                    import.meta.url,
                    "../../fixtures/dicomFiles",
                    TEST_INSTANCE_1.file,
                ),
            ),
        },
        {
            sopInstanceUid: TEST_INSTANCE_2.sopInstanceUid,
            instanceFile: path.resolve(
                join(
                    import.meta.url,
                    "../../fixtures/dicomFiles",
                    TEST_INSTANCE_2.file,
                ),
            ),
        },
    ],
};

describe("WADO-RS Series Route", () => {
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

        const testFileManager = new TestFileManager();
        for (const instance of TEST_DICOM_DATA.instances) {
            const res = await testFileManager.uploadTestFile(
                instance.instanceFile,
            );
            expect(res.status).toBe(200);
        }
    });

    describe("GET /workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid", () => {
        it('should retrieve series instances with multipart/related; type="application/dicom"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: 'multipart/related; type="application/dicom"',
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);

            const parts = multipartDecode(await response.arrayBuffer());
            expect(parts.length).toBe(TEST_DICOM_DATA.instances.length);
        });

        it("should retrieve series instances as zip", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: "application/zip",
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toBe(
                "application/zip",
            );
        });

        it('should retrieve series instances as multipart/related; type="image/jpeg"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/jpeg"',
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/jpeg"',
            );
        });

        it('should retrieve series instances as multipart/related; type="image/jp2"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/jp2"',
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/jp2"',
            );
        });

        it('should retrieve series instances as multipart/related; type="image/png"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/png"',
                    },
                },
            );

            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/png"',
            );
        });

        it("should handle window parameter", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/jpeg"',
                        window: "1024,2048,linear",
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/jpeg"',
            );
        });

        it("should handle quality parameter", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?quality=85`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/jpeg"',
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/jpeg"',
            );
        });

        it("should reject invalid quality parameter", async () => {
            const invalidParams = [
                {
                    quality: "0",
                },
                {
                    quality: "101",
                },
                {
                    quality: "abc",
                },
            ];

            for (const params of invalidParams) {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?${new URLSearchParams(params)}`,
                );
                // Assert
                expect(response.status).toBe(400);
            }
        });

        it("should handle iccprofile parameter", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?iccprofile=srgb`,
                {
                    headers: {
                        accept: 'multipart/related; type="image/jpeg"',
                    },
                },
            );
            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="image/jpeg"',
            );
        });

        it("should reject invalid iccprofile parameter", async () => {
            const invalidParams = [
                {
                    iccprofile: "invalid",
                },
            ];

            for (const params of invalidParams) {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?${new URLSearchParams(params)}`,
                );
                // Assert
                expect(response.status).toBe(400);
            }
        });

        it("should handle viewport parameter", async () => {
            const validParams = [
                {
                    viewport: "1024,1024",
                },
                {
                    viewport: "1024,1024,0,0,1024,1024",
                },
                {
                    viewport: "1024,1024,0,0,-1024,-1024",
                },
                {
                    viewport: "1024,1024,,,-1024,-1024",
                },
            ];

            for (const params of validParams) {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            accept: 'multipart/related; type="image/jpeg"',
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toContain(
                    'multipart/related; type="image/jpeg"',
                );
            }
        });

        it("should reject invalid viewport parameter", async () => {
            const invalidParams = [
                {
                    viewport: "invalid",
                },
                {
                    viewport: "1024,1024,0,0",
                },
            ];

            for (const params of invalidParams) {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            accept: 'multipart/related; type="image/jpeg"',
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(400);
            }
        });

        it("should return 404 for non-existent series", async () => {
            const nonExistentSeries = "non-existent-series";

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${nonExistentSeries}`,
            );
            // Assert
            expect(response.status).toBe(404);
        });

        it("should return 400 for unsupported accept header", async () => {
            const unsupportedAccept = "application/pdf";

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`,
                {
                    headers: {
                        accept: unsupportedAccept,
                    },
                },
            );
            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("Service Error Handling", () => {
        it("should handle SeriesService errors", async () => {
            const { SeriesService } = await import(
                "@/server/services/series.service"
            );
            vi.spyOn(
                SeriesService.prototype,
                "getSeriesByUid",
            ).mockRejectedValue(new Error("Database error"));

            const seriesPath = `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}`;

            // Act
            const response = await app.request(seriesPath, {
                headers: {
                    accept: 'multipart/related; type="application/dicom"',
                },
            });
            // Assert
            expect(response.status).toBe(500);
        });
    });
});
