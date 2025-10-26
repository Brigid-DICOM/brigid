import type { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { StudyEntity } from "@brigid/database/src/entities/study.entity";
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
import {
    app
} from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../../../utils/testDatabaseManager";
import {
    keywordPathToTagPath,
    type SearchDicomTestOptions
} from "../../../utils/testUtils";
import { WORKSPACE_ID } from "../../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("QIDO-RS Search Study Series Instances Route", () => {
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

    const itShouldSearchStudySeriesInstancesWith = (options: SearchDicomTestOptions) => {
        const {
            queryParamPath,
            searchValue,
            expectedCount,
            statusCode = 200,
            expectDicomValue,
            customAssertion,
            title
        } = options;

        const runTest = async (param: string) => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?${param}=${encodeURIComponent(searchValue)}`,
            );

            expect(response.status).toBe(statusCode);

            if (statusCode === 200) {
                const instances = await response.json();
                expect(instances.length).toBe(expectedCount);

                if (expectDicomValue) {
                    const { tag, value, index = 0 } = expectDicomValue;
                    expect(get(instances[index], `${tag}.Value.0`)).toBe(value);
                }

                if (customAssertion) {
                    await customAssertion(instances, response);
                }
            }
        };

        it(title ?? `should query by ${queryParamPath}`, async () => {
            await runTest(queryParamPath);
        });
    };

    describe("GET /workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances", () => {
        it("should return all instances of series", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances`,
            );

            expect(response.status).toBe(200);
            const instances = await response.json();
            expect(instances.length).toBe(1);
        });

        it("should return 404 for non-existent workspace", async () => {
            const nonExistentWorkspaceId = "non-existent-workspace-id";
            const response = await app.request(
                `/api/workspaces/${nonExistentWorkspaceId}/studies/${testStudies[0].studyInstanceUid}/series/${testSeries[0].seriesInstanceUid}/instances`,
            );

            expect(response.status).toBe(404);
        });

        it("should return 204 for non-existent study", async () => {
            const nonExistentStudyInstanceUid = "non-existent-study-instance-uid";
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${nonExistentStudyInstanceUid}/series/${testSeries[0].seriesInstanceUid}/instances`,
            );

            expect(response.status).toBe(204);
        });

        it("should return 204 for non-existent series", async () => {
            const nonExistentSeriesInstanceUid = "non-existent-series-instance-uid";

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudies[0].studyInstanceUid}/series/${nonExistentSeriesInstanceUid}/instances`,
            );

            expect(response.status).toBe(204);
        });

        it("should return DICOM JSON format", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances`,
            );

            const instances = await response.json();
            expect(instances[0]).toHaveProperty("00080016"); // SOP Class UID
            expect(instances[0]).toHaveProperty("00080018"); // SOP Instance UID
            expect(instances[0]).toHaveProperty("0020000D"); // Study Instance UID
            expect(instances[0]).toHaveProperty("0020000E"); // Series Instance UID
        });
    });

    describe("parameter validation", () => {
        it("should accept limit parameter", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?limit=1`,
            );

            expect(response.status).toBe(200);
            const instances = await response.json();
            expect(instances.length).toBe(1);
        });

        it("should reject invalid limit parameter", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?limit=0`,
            );

            expect(response.status).toBe(400);
        });

        it("should reject limit exceeding max", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?limit=1001`,
            );
            
            expect(response.status).toBe(400);
        });

        it("should accept offset parameter", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?offset=1`,
            );

            expect(response.status).toBe(204);
        });

        it("should reject negative offset parameter", async () => {
            const testStudy = testStudies[0];
            const aTestSeries = testSeries[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${testStudy.studyInstanceUid}/series/${aTestSeries.seriesInstanceUid}/instances?offset=-1`,
            );

            expect(response.status).toBe(400);
        });
    });

    describe("SOPClassUID queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "SOPClassUID",
            searchValue: "1.2.840.113619.5.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080016",
                value: "1.2.840.113619.5.1",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("SOPClassUID"),
            searchValue: "1.2.840.113619.5.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080016",
                value: "1.2.840.113619.5.1",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support wildcard",
            queryParamPath: "SOPClassUID",
            searchValue: "1.2.840.113619.5.*",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should return 204 for non-existent SOPClassUID",
            queryParamPath: "SOPClassUID",
            searchValue: "non-existent-sop-class-uid",
            expectedCount: 0,
            statusCode: 204
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support multiple SOPClassUIDs",
            queryParamPath: "SOPClassUID",
            searchValue: "1.2.840.113619.5.1,1.2.840.113619.5.2",
            expectedCount: 1,
        });
    });

    describe("SOPInstanceUID queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "SOPInstanceUID",
            searchValue: "1.2.840.113619.5.1.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080018",
                value: "1.2.840.113619.5.1.1",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("SOPInstanceUID"),
            searchValue: "1.2.840.113619.5.1.1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080018",
                value: "1.2.840.113619.5.1.1",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support wildcard",
            queryParamPath: "SOPInstanceUID",
            searchValue: "1.2.840.113619.5.1.*",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should return 204 for non-existent SOPInstanceUID",
            queryParamPath: "SOPInstanceUID",
            searchValue: "non-existent-sop-instance-uid",
            expectedCount: 0,
            statusCode: 204
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support multiple SOPInstanceUIDs",
            queryParamPath: "SOPInstanceUID",
            searchValue: "1.2.840.113619.5.1.1,1.2.840.113619.5.1.2",
            expectedCount: 1,
        });
    });

    describe("InstanceNumber queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "InstanceNumber",
            searchValue: "1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00200013",
                value: 1,
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("InstanceNumber"),
            searchValue: "1",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00200013",
                value: 1,
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should return 204 for non-existent InstanceNumber",
            queryParamPath: "InstanceNumber",
            searchValue: "1111",
            expectedCount: 0,
            statusCode: 204
        });
    });

    describe("AcquisitionDate queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "AcquisitionDate",
            searchValue: "20241017",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080022",
                value: "20241017",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("AcquisitionDate"),
            searchValue: "20241017",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080022",
                value: "20241017",
            }
        });
    });

    describe("AcquisitionDateTime queries", () => {
        // 不進行 exact match，因為 datetime 的精度顆粒度過細，可能無法完全匹配，所以確認 range match 即可

        itShouldSearchStudySeriesInstancesWith({
            title: "should support datetime range",
            queryParamPath: "AcquisitionDateTime",
            searchValue: "20241016-20241018",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support start datetime",
            queryParamPath: "AcquisitionDateTime",
            searchValue: "20241016-",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support end datetime",
            queryParamPath: "AcquisitionDateTime",
            searchValue: "-20241017235959.999999",
            expectedCount: 1,
        });
    });

    describe("ContentDate queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "ContentDate",
            searchValue: "20241017",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080023",
                value: "20241017",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("ContentDate"),
            searchValue: "20241017",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080023",
                value: "20241017",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support date range",
            queryParamPath: "ContentDate",
            searchValue: "20241017-20241018",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support start date",
            queryParamPath: "ContentDate",
            searchValue: "20241017-",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support end date",
            queryParamPath: "ContentDate",
            searchValue: "-20241018",
            expectedCount: 1,
        });
    });

    describe("ContentTime queries", () => {
        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: "ContentTime",
            searchValue: "150500.000000",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080033",
                value: "150500.000000",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            queryParamPath: keywordPathToTagPath("ContentTime"),
            searchValue: "150500.000000",
            expectedCount: 1,
            expectDicomValue: {
                tag: "00080033",
                value: "150500.000000",
            }
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support time range",
            queryParamPath: "ContentTime",
            searchValue: "100500.000000-150500.999999",
            expectedCount: 1,
        });
        
        itShouldSearchStudySeriesInstancesWith({
            title: "should support start time",
            queryParamPath: "ContentTime",
            searchValue: "100500.000000-",
            expectedCount: 1,
        });

        itShouldSearchStudySeriesInstancesWith({
            title: "should support end time",
            queryParamPath: "ContentTime",
            searchValue: "-150500.999999",
            expectedCount: 1,
        });
    });
});