import test from "node:test";
import type { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { get } from "lodash";
import type { DataSource } from "typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app/api/[...route]/route";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import { TestDatabaseManager } from "../../../utils/testDatabaseManager";
import {
    keywordPathToTagPath,
    SearchDicomTestOptions,
} from "../../../utils/testUtils";
import { WORKSPACE_ID } from "../../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("QIDO-RS Search Study Series Route", () => {
    let testDb: TestDatabaseManager;
    let testStudies: StudyEntity[];
    let testSeries: SeriesEntity[];

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

        const seedData = await testDb.seedTestData();
        testStudies = seedData.studies;
        testSeries = seedData.series;
    });

    const itShouldSearchStudySeriesWith = (options: SearchDicomTestOptions) => {
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
            const testStudy = testStudies[0];
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?${param}=${encodeURIComponent(searchValue)}`,
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

    describe("GET /workspaces/:workspaceId/studies/:studyInstanceUid/series", () => {
        describe("basic queries", () => {
            it("should return all series of study", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(2);
            });

            it("should return 404 for non-existent workspace", async () => {
                const testStudy = testStudies[0];
                const nonExistentWorkspaceId = "non-existent-workspace-id";
                const response = await app.request(
                    `/api/workspaces/${nonExistentWorkspaceId}/studies/${testStudy.studyInstanceUid}/series`,
                );

                expect(response.status).toBe(404);
            });

            it("should return 204 for non-existent study", async () => {
                const nonExistentStudyInstanceUid =
                    "non-existent-study-instance-uid";
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${nonExistentStudyInstanceUid}/series`,
                );

                expect(response.status).toBe(204);
            });

            it("should return DICOM JSON format", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series`,
                );

                const series = await response.json();
                expect(series[0]).toHaveProperty("0020000D"); // Series Instance UID
                expect(series[0]).toHaveProperty("00080060"); // Modality
            });
        });

        describe("parameter validation", () => {
            it("should accept limit parameter", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?limit=1`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(1);
            });

            it("should reject invalid limit parameter", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?limit=0`,
                );

                expect(response.status).toBe(400);
            });

            it("should reject limit exceeding max", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?limit=1001`,
                );

                expect(response.status).toBe(400);
            });

            it("should accept offset parameter", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?offset=1`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(1);
            });

            it("should reject negative offset parameter", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?offset=-1`,
                );

                expect(response.status).toBe(400);
            });
        });

        describe("SeriesInstanceUID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "SeriesInstanceUID",
                searchValue: "1.2.3.4.5.1.1",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "0020000E",
                    value: "1.2.3.4.5.1.1",
                },
                customAssertion: async (series, response) => {
                    expect(series[0]["0020000E"].Value[0]).toBe(
                        "1.2.3.4.5.1.1",
                    );
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath("SeriesInstanceUID"),
                searchValue: "1.2.3.4.5.1.1",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "0020000E",
                    value: "1.2.3.4.5.1.1",
                },
                customAssertion: async (series, response) => {
                    expect(series[0]["0020000E"].Value[0]).toBe(
                        "1.2.3.4.5.1.1",
                    );
                },
            });

            const wildcardValue = "1.2.3.4.5.1.*";
            itShouldSearchStudySeriesWith({
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
            itShouldSearchStudySeriesWith({
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
            itShouldSearchStudySeriesWith({
                queryParamPath: "Modality",
                searchValue: "CT",
                expectedCount: 2,
                expectDicomValue: {
                    tag: "00080060",
                    value: "CT",
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath("Modality"),
                searchValue: "CT",
                expectedCount: 2,
                expectDicomValue: {
                    tag: "00080060",
                    value: "CT",
                },
            });

            itShouldSearchStudySeriesWith({
                title: "should support wildcard",
                queryParamPath: "Modality",
                searchValue: "C*",
                expectedCount: 2,
                customAssertion: async (series, response) => {
                    expect(
                        series.every((series: any) =>
                            series["00080060"].Value[0].startsWith("C"),
                        ),
                    ).toBe(true);
                },
            });

            itShouldSearchStudySeriesWith({
                title: "should support multiple modalities",
                queryParamPath: "Modality",
                searchValue: "CT,MR",
                expectedCount: 2,
                customAssertion: async (series, response) => {
                    expect(
                        series.every(
                            (series: any) =>
                                series["00080060"].Value[0] === "CT" ||
                                series["00080060"].Value[0] === "MR",
                        ),
                    ).toBe(true);
                },
            });
        });

        describe("SeriesNumber queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "SeriesNumber",
                searchValue: "1",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "00200011",
                    value: 1,
                },
                customAssertion: async (series, response) => {
                    expect(series[0]["00200011"].Value[0]).toBe(1);
                },
            });

            it("should support negative series number", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesNumber=-${testSeries[0].seriesNumber}`,
                );

                expect(response.status).toBe(204);
            });
        });

        describe("SeriesDate queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "SeriesDate",
                searchValue: "20241017",
                expectedCount: 2,
                expectDicomValue: {
                    tag: "00080021",
                    value: "20241017",
                },
            });

            itShouldSearchStudySeriesWith({
                title: "should support date ranges",
                queryParamPath: "SeriesDate",
                searchValue: "20241017-20241018",
                expectedCount: 2,
            });

            itShouldSearchStudySeriesWith({
                title: "should support start date",
                queryParamPath: "SeriesDate",
                searchValue: "20241017-",
                expectedCount: 2,
            });

            itShouldSearchStudySeriesWith({
                title: "should support end date",
                queryParamPath: "SeriesDate",
                searchValue: "-20241017",
                expectedCount: 2,
            });
        });

        describe("SeriesTime queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "SeriesTime",
                searchValue: "144000.000000",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "00080031",
                    value: "144000.000000",
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath("SeriesTime"),
                searchValue: "144000.000000",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "00080031",
                    value: "144000.000000",
                },
            });

            it("should support time ranges", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesTime=144000.000000-144000.999999`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(1);
            });

            it("should support start time", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesTime=134000.000000-`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(2);
            });

            it("should support end time", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesTime=-144000.000000`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(2);
            });
        });

        describe("SeriesDescription queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "SeriesDescription",
                searchValue: "Chest Arterial Phase",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "0008103E",
                    value: "Chest Arterial Phase",
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath("SeriesDescription"),
                searchValue: "Chest Arterial Phase",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "0008103E",
                    value: "Chest Arterial Phase",
                },
            });

            itShouldSearchStudySeriesWith({
                title: "should support wildcard",
                queryParamPath: "SeriesDescription",
                searchValue: "Chest*",
                expectedCount: 2,
                customAssertion: async (series, response) => {
                    expect(
                        series.every((series: any) =>
                            series["0008103E"].Value[0].includes("Chest"),
                        ),
                    ).toBe(true);
                },
            });

            itShouldSearchStudySeriesWith({
                title: "should support multiple descriptions",
                queryParamPath: "SeriesDescription",
                searchValue: "Chest Arterial Phase,Chest Venous Phase",
                expectedCount: 2,
                customAssertion: async (series, response) => {
                    expect(
                        series.every(
                            (series: any) =>
                                series["0008103E"].Value[0] ===
                                    "Chest Arterial Phase" ||
                                series["0008103E"].Value[0] ===
                                    "Chest Venous Phase",
                        ),
                    ).toBe(true);
                },
            });
        });

        describe("PerformedProcedureStepStartDate queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "PerformedProcedureStepStartDate",
                searchValue: "20241017",
                expectedCount: 2,
                expectDicomValue: {
                    tag: "00400244",
                    value: "20241017",
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "PerformedProcedureStepStartDate",
                ),
                searchValue: "20241017",
                expectedCount: 2,
                expectDicomValue: {
                    tag: "00400244",
                    value: "20241017",
                },
            });
        });

        describe("PerformedProcedureStepStartTime queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "PerformedProcedureStepStartTime",
                searchValue: "144000.000000",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "00400245",
                    value: "144000.000000",
                },
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "PerformedProcedureStepStartTime",
                ),
                searchValue: "144000.000000",
                expectedCount: 1,
                expectDicomValue: {
                    tag: "00400245",
                    value: "144000.000000",
                },
            });
        });

        describe("SeriesRequestAttributes.StudyInstanceUID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.StudyInstanceUID",
                searchValue: "1.2.3.4.5.1",
                expectedCount: 2
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.StudyInstanceUID"
                ),
                searchValue: "1.2.3.4.5.1",
                expectedCount: 2
            });
        });

        describe("SeriesRequestAttributes.AccessionNumber queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.AccessionNumber",
                searchValue: "REQACC001",
                expectedCount: 1
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.AccessionNumber"
                ),
                searchValue: "REQACC001",
                expectedCount: 1
            });
        });

        describe("SeriesRequestAttributes.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID",
                searchValue: "LOCAL_ENTITY_ID_1",
                expectedCount: 1
            });
           
            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID"
                ),
                searchValue: "LOCAL_ENTITY_ID_1",
                expectedCount: 1
            });

            itShouldSearchStudySeriesWith({
                title: "should support wildcard",
                queryParamPath: "RequestAttributesSequence.IssuerOfAccessionNumberSequence.LocalNamespaceEntityID",
                searchValue: "LOCAL*",
                expectedCount: 2
            });
        });

        describe("SeriesRequestAttributes.IssuerOfAccessionNumberSequence.UniversalEntityID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityID",
                searchValue: "2f6316f6-0d26-4f17-b5b4-0d296673da0c",
                expectedCount: 1
            });

            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityID",
                ),
                searchValue: "2f6316f6-0d26-4f17-b5b4-0d296673da0c",
                expectedCount: 1
            });
        });

        describe("SeriesRequestAttributes.IssuerOfAccessionNumberSequence.UniversalEntityIDType queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityIDType",
                searchValue: "UUID",
                expectedCount: 2
            });
           
            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.IssuerOfAccessionNumberSequence.UniversalEntityIDType"
                ),
                searchValue: "UUID",
                expectedCount: 2
            });
        });

        describe("SeriesRequestAttributes.ScheduledProcedureStepID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.ScheduledProcedureStepID",
                searchValue: "SPS-1",
                expectedCount: 1
            });
           
            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.ScheduledProcedureStepID"
                ),
                searchValue: "SPS-1",
                expectedCount: 1
            });
        });

        describe("SeriesRequestAttributes.RequestedProcedureID queries", () => {
            itShouldSearchStudySeriesWith({
                queryParamPath: "RequestAttributesSequence.RequestedProcedureID",
                searchValue: "RP-1",
                expectedCount: 1
            });
           
            itShouldSearchStudySeriesWith({
                queryParamPath: keywordPathToTagPath(
                    "RequestAttributesSequence.RequestedProcedureID"
                ),
                searchValue: "RP-1",
                expectedCount: 1
            });
        });

        describe("combined queries", () => {
            it("should combine multiple parameters", async () => {
                const testStudy = testStudies[0];
                const queryParams = {
                    Modality: "CT",
                    SeriesNumber: "1",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(1);
                expect(series[0]["00080060"].Value[0]).toBe("CT");
                expect(series[0]["00200011"].Value[0]).toBe(1);
            });

            it("should handle complex combined parameters", async () => {
                const testStudy = testStudies[0];
                const queryParams = {
                    Modality: "CT",
                    SeriesDate: "20241017-20241018",
                    SeriesTime: "144000.000000-144000.999999",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(200);
                const series = await response.json();
                expect(series.length).toBe(1);
            });

            it("should return empty for non-matching combinations", async () => {
                const testStudy = testStudies[0];
                const queryParams = {
                    Modality: "MX",
                    SeriesNumber: "1",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(204);
            });
        });

        describe("edge cases", () => {
            it("should handle invalid date format", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesDate=20241017-20241017-20241018`,
                );

                expect(response.status).toBe(400);
            });

            it("should handle invalid time format", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesTime=144000.000000-144000.999999-144000.000000`,
                );

                expect(response.status).toBe(400);
            });

            it("should handle invalid number format", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series?SeriesNumber=abc`,
                );

                expect(response.status).toBe(400);
            });
        });
    });
});
