import { get } from "lodash";
import type { DataSource } from "typeorm";
import {
    afterAll,
    beforeAll,
    beforeEach,
    describe,
    expect,
    it
} from "vitest";
import { app } from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../../../utils/testDatabaseManager";
import {
    keywordPathToTagPath,
    type SearchDicomTestOptions,
} from "../../../utils/testUtils";
import { WORKSPACE_ID } from "../../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("QIDO-RS Search Instances Route", () => {
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
        await testDb.clearDatabase();
        await testDb.seedTestData();
    });

    const itShouldSearchInstancesWith = (options: SearchDicomTestOptions) => {
        const {
            queryParamPath,
            searchValue,
            expectedCount,
            statusCode = 200,
            expectDicomValue,
            customAssertion,
            title,
        } = options;

        const runTest = async (param: string) => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/instances?${param}=${encodeURIComponent(searchValue)}`,
            );

            expect(response.status).toBe(statusCode);

            if (statusCode === 200) {
                const series = await response.json();
                expect(series.length).toBe(expectedCount);

                if (expectDicomValue) {
                    const { tag, value, index = 0 } = expectDicomValue;
                    expect(get(series[index], `${tag}.Value.0`)).toBe(value);
                }

                if (customAssertion) {
                    await customAssertion(series, response);
                }
            }
        };

        it(title ?? `should query by ${queryParamPath}`, async () => {
            await runTest(queryParamPath);
        });
    };

    describe("GET /workspaces/:workspaceId/instances", () => {
        it("should return all instances of workspace", async () => {
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/instances`,
            );

            expect(response.status).toBe(200);
            const instances = await response.json();
            expect(instances.length).toBe(4);
        });

        it("should return 404 for non-existent workspace", async () => {
            const nonExistentWorkspaceId = "non-existent-workspace-id";
            const response = await app.request(
                `/api/workspaces/${nonExistentWorkspaceId}/instances`,
            );

            expect(response.status).toBe(404);
        });
    });

    describe("StudyInstanceUID queries", () => {
        itShouldSearchInstancesWith({
            queryParamPath: "StudyInstanceUID",
            searchValue: "1.2.3.4.5.1",
            expectedCount: 2,
            expectDicomValue: {
                tag: "0020000D",
                value: "1.2.3.4.5.1",
            },
        });
    });

    describe("SeriesInstanceUID queries", () => {
        itShouldSearchInstancesWith({
            queryParamPath: "SeriesInstanceUID",
            searchValue: "1.2.3.4.5.1.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "0020000E",
                value: "1.2.3.4.5.1.1",
            },
        });
    });

    describe("SOPClassUID queries", () => {
        itShouldSearchInstancesWith({
            queryParamPath: "SOPClassUID",
            searchValue: "1.2.840.113619.5.1",
            expectedCount: 4,
            expectDicomValue: {
                tag: "00080016",
                value: "1.2.840.113619.5.1",
            },
        });

        itShouldSearchInstancesWith({
            title: "return 204 for non-existent SOPClassUID",
            queryParamPath: "SOPClassUID",
            searchValue: "non-existent-sop-class-uid",
            expectedCount: 0,
            statusCode: 204,
        });
    });
});