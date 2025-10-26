import { get } from "lodash";
import type { DataSource } from "typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
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

describe("QIDO-RS Search Series Route", () => {
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

    const itShouldSearchSeriesWith = (options: SearchDicomTestOptions) => {
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
                `/api/workspaces/${WORKSPACE_ID}/series?${param}=${encodeURIComponent(searchValue)}`,
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

    describe("GET /workspaces/:workspaceId/series", () => {
        describe("basic queries", () => {
            it("should return all series", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/series`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(4);
            });
        });
    });

    describe("SeriesInstanceUID queries", () => {
        itShouldSearchSeriesWith({
            queryParamPath: "SeriesInstanceUID",
            searchValue: "1.2.3.4.5.1.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "0020000E",
                value: "1.2.3.4.5.1.1",
            },
        });

        itShouldSearchSeriesWith({
            queryParamPath: keywordPathToTagPath("SeriesInstanceUID"),
            searchValue: "1.2.3.4.5.1.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "0020000E",
                value: "1.2.3.4.5.1.1",
            },
        });

        const wildcardValue = "1.2.3.4.5.1.*";
        itShouldSearchSeriesWith({
            title: "should support UID wildcard",
            queryParamPath: "SeriesInstanceUID",
            searchValue: wildcardValue,
            expectedCount: 2,
            customAssertion: async (series, response) => {
                expect(
                    series.every((series: any) =>
                        series["0020000E"].Value[0].includes(
                            wildcardValue.slice(0, -1),
                        ),
                    ),
                ).toBe(true);
            },
        });

        const multipleUidsValue = "1.2.3.4.5.1.1,1.2.3.4.5.1.2";
        itShouldSearchSeriesWith({
            title: "should support multiple UIDs",
            queryParamPath: "SeriesInstanceUID",
            searchValue: multipleUidsValue,
            expectedCount: 2,
            customAssertion: async (series, response) => {
                expect(series.length).toBe(2);
                expect(
                    series.every(
                        (series: any) =>
                            series["0020000E"].Value[0] ===
                                multipleUidsValue.split(",")[0] ||
                            series["0020000E"].Value[0] ===
                                multipleUidsValue.split(",")[1],
                    ),
                ).toBe(true);
            },
        });
    });

    describe("Modality queries", () => {
        itShouldSearchSeriesWith({
            queryParamPath: "Modality",
            searchValue: "CT",
            expectedCount: 3,
            expectDicomValue: {
                tag: "00080060",
                value: "CT",
            },
        });

        itShouldSearchSeriesWith({
            title: "should support wildcard",
            queryParamPath: "Modality",
            searchValue: "C*",
            expectedCount: 3,
            customAssertion: async (series, response) => {
                expect(
                    series.every((series: any) =>
                        series["00080060"].Value[0].startsWith("C"),
                    ),
                ).toBe(true);
            },
        });

        itShouldSearchSeriesWith({
            title: "return 204 for non-existent modality",
            queryParamPath: "Modality",
            searchValue: "non-existent-modality",
            expectedCount: 0,
            statusCode: 204,
        });
    });

    describe("StudyInstanceUID queries", () => {
        itShouldSearchSeriesWith({
            queryParamPath: "StudyInstanceUID",
            searchValue: "1.2.3.4.5.1",
            expectedCount: 2,
            expectDicomValue: {
                tag: "0020000D",
                value: "1.2.3.4.5.1",
            },
        });
    });
});
