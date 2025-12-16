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
import testData from "../../fixtures/dicomFiles/data.json";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { TestFileManager } from "../../utils/testFileManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

const TEST_STUDY_KEY =
    "1.3.6.1.4.1.14519.5.2.1.3023.4017.246199836259881483055596634768";
const TEST_STUDY = testData[TEST_STUDY_KEY];
const TEST_SERIES = TEST_STUDY.series[0];
const TEST_INSTANCE = TEST_SERIES.instances[0];

const TEST_DICOM_DATA = {
    studyInstanceUid: TEST_STUDY_KEY,
    seriesInstanceUid: TEST_SERIES.seriesInstanceUid,
    sopInstanceUid: TEST_INSTANCE.sopInstanceUid,
    instanceFile: path.resolve(
        join(import.meta.url, "../../fixtures/dicomFiles", TEST_INSTANCE.file),
    ),
};

describe("WADO-URI Route", () => {
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

        const res = await testFileManager.uploadTestFile(
            TEST_DICOM_DATA.instanceFile,
        );
        expect(res.status).toBe(200);
    });

    describe("GET /workspaces/:workspaceId/wado-uri", () => {
        const baseParams = {
            requestType: "WADO",
            studyUID: TEST_DICOM_DATA.studyInstanceUid,
            seriesUID: TEST_DICOM_DATA.seriesInstanceUid,
            objectUID: TEST_DICOM_DATA.sopInstanceUid,
        };

        describe("basic functionality test", () => {
            it("should retrieve DICOM instance successfully with default parameters", async () => {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(baseParams)}`,
                );

                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe(
                    "application/dicom",
                );
            });

            it("should retrieve DICOM instance with image/jpeg content type", async () => {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(
                        {
                            ...baseParams,
                            contentType: "image/jpeg",
                        },
                    )}`,
                );

                // Assert
                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe("image/jpeg");
            });
        });

        describe("content type parameter test", () => {
            const supportedTypes = [
                "application/dicom",
                "image/jpeg",
                "image/jp2",
                "image/png",
            ];

            for (const contentType of supportedTypes) {
                it(`should retrieve DICOM instance with ${contentType} content type`, async () => {
                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(
                            {
                                ...baseParams,
                                contentType: contentType,
                            },
                        )}`,
                    );

                    // Assert
                    expect(response.status).toBe(200);
                    expect(response.headers.get("Content-Type")).toBe(
                        contentType,
                    );
                });
            }

            it("should return 400 if the content type is not supported", async () => {
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(
                        {
                            ...baseParams,
                            contentType: "application/pdf",
                        },
                    )}`,
                );

                // Assert
                expect(response.status).toBe(400);
            });
        });

        describe("image processing parameters test", () => {
            it("should handle row and column parameters", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    row: "512",
                    column: "512",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );

                // Assert
                expect(response.status).toBe(200);
                expect(response.headers.get("Content-Type")).toBe("image/jpeg");
            });

            it("should reject invalid row and column parameters", async () => {
                const invalidParams = [
                    { ...baseParams, row: "0" },
                    { ...baseParams, column: "-1" },
                    { ...baseParams, row: "abc" },
                ];

                for (const params of invalidParams) {
                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                        {
                            headers: {
                                Accept: "image/jpeg",
                            },
                        },
                    );
                    // Assert
                    expect(response.status).toBe(400);
                }
            });

            it("should handle region parameter", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    region: "0,0,0.5,0.5",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );

                // Assert
                expect(response.status).toBe(200);
            });

            it("should reject invalid region parameter", async () => {
                const invalidRegions = [
                    "0.1,0.2,0.3", // 缺少參數
                    "0.5,0.5,0.3,0.3", // xmin >= xmax
                    "0.5,0.5,0.3,0.6", // ymin >= ymax
                    "-0.1,0.2,0.3,0.4", // 負值
                    "abc,def,ghi,jkl", // 非數字
                ];

                for (const region of invalidRegions) {
                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(
                            {
                                ...baseParams,
                                region: region,
                            },
                        )}`,
                    );
                    // Assert
                    expect(response.status).toBe(400);
                }
            });

            it("should handle windowCenter and windowWidth parameters", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    windowCenter: "1024",
                    windowWidth: "2048",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(200);
            });

            it("should return 400 if windowCenter is provided but windowWidth is not", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    windowCenter: "1024",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                );
                // Assert
                expect(response.status).toBe(400);
            });

            it("should return 400 if windowWidth is provided but windowCenter is not", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    windowWidth: "2048",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                );
                // Assert
                expect(response.status).toBe(400);
            });

            it("should handle imageQuality parameter", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    imageQuality: "100",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(200);
            });

            it("should reject invalid imageQuality parameter", async () => {
                const invalidParams = [
                    { ...baseParams, imageQuality: "0" },
                    { ...baseParams, imageQuality: "101" },
                    { ...baseParams, imageQuality: "abc" },
                ];

                for (const params of invalidParams) {
                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    );
                    // Assert
                    expect(response.status).toBe(400);
                }
            });

            it("should handle frameNumber parameter", async () => {
                const params = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    frameNumber: "1",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(200);
            });

            it("should reject invalid frameNumber parameter", async () => {
                const invalidParams = [
                    { ...baseParams, frameNumber: "-1" },
                    { ...baseParams, frameNumber: "0" },
                    { ...baseParams, frameNumber: "abc" },
                    {
                        ...baseParams,
                        frameNumber: "100",
                        contentType: "image/jpeg",
                    },
                ];

                for (const params of invalidParams) {
                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                    );
                    // Assert
                    expect(response.status).toBe(400);
                }
            });
        });

        describe("required parameters test", () => {
            const requiredParams = [
                "requestType",
                "studyUID",
                "seriesUID",
                "objectUID",
            ];

            for (const param of requiredParams) {
                it(`should return 400 when missing ${param} parameter`, async () => {
                    const incompleteParams = { ...baseParams };
                    delete incompleteParams[
                        param as keyof typeof incompleteParams
                    ];

                    // Act
                    const response = await app.request(
                        `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(incompleteParams)}`,
                    );
                    // Assert
                    expect(response.status).toBe(400);
                });
            }

            it("should return 400 when requestType is not WADO", async () => {
                const params = {
                    ...baseParams,
                    requestType: "WADO-RS",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(params)}`,
                );
                // Assert
                expect(response.status).toBe(400);
            });
        });

        describe("error handling test", () => {
            it("should return 404 for non-existent workspace", async () => {
                const nonExistentWorkspaceId = "non-existent-workspace-id";

                // Act
                const response = await app.request(
                    `/api/workspaces/${nonExistentWorkspaceId}/wado-uri?${new URLSearchParams(baseParams)}`,
                );
                // Assert
                expect(response.status).toBe(404);
            });

            it("should return 404 for non-existent instance", async () => {
                const nonExistentInstance = "non-existent-instance";
                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(
                        {
                            ...baseParams,
                            objectUID: nonExistentInstance,
                        },
                    )}`,
                );
                // Assert
                expect(response.status).toBe(404);
            });
        });

        describe("comprehensive parameters test", () => {
            it("should handle multiple parameters", async () => {
                const complexParams = {
                    ...baseParams,
                    contentType: "image/jpeg",
                    row: "256",
                    column: "256",
                    imageQuality: "85",
                    frameNumber: "1",
                };

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/wado-uri?${new URLSearchParams(complexParams)}`,
                    {
                        headers: {
                            Accept: "image/jpeg",
                        },
                    },
                );
                // Assert
                expect(response.status).toBe(200);
            });
        });
    });
});
