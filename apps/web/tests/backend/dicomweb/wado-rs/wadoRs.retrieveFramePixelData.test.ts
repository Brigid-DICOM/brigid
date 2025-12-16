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
import testData from "../../../fixtures/dicomFiles/data.json";
import { TestDatabaseManager } from "../../../utils/testDatabaseManager";
import { TestFileManager } from "../../../utils/testFileManager";
import { WORKSPACE_ID } from "../../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

// 使用 data.json 中的真實資料
const TEST_STUDY_KEY =
    "1.3.46.670589.45.1.1.4993912214784.1.5436.1538560373543";
const TEST_STUDY = testData[TEST_STUDY_KEY];
const TEST_SERIES = TEST_STUDY.series[0];
const TEST_INSTANCE = TEST_SERIES.instances[0];
const TEST_STUDY_KEY_2 =
    "1.3.6.1.4.1.14519.5.2.1.3023.4017.246199836259881483055596634768";
const TEST_STUDY_2 = testData[TEST_STUDY_KEY_2];
const TEST_SERIES_2 = TEST_STUDY_2.series[0];
const TEST_INSTANCE_2 = TEST_SERIES_2.instances[0];

// compressed frame dicom file
const TEST_DICOM_DATA = {
    studyInstanceUid: TEST_STUDY_KEY,
    seriesInstanceUid: TEST_SERIES.seriesInstanceUid,
    sopInstanceUid: TEST_INSTANCE.sopInstanceUid,
    instanceFile: path.resolve(
        join(
            import.meta.url,
            "../../../fixtures/dicomFiles",
            TEST_INSTANCE.file,
        ),
    ),
};

// uncompressed frame dicom file
const TEST_DICOM_DATA_2 = {
    studyInstanceUid: TEST_STUDY_KEY_2,
    seriesInstanceUid: TEST_SERIES_2.seriesInstanceUid,
    sopInstanceUid: TEST_INSTANCE_2.sopInstanceUid,
    instanceFile: path.resolve(
        join(
            import.meta.url,
            "../../../fixtures/dicomFiles",
            TEST_INSTANCE_2.file,
        ),
    ),
};

describe("WADO-RS Retrieve Frame Pixel Data Route", () => {
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
        const res2 = await testFileManager.uploadTestFile(
            TEST_DICOM_DATA_2.instanceFile,
        );
        expect(res.status).toBe(200);
        expect(res2.status).toBe(200);
    });

    describe("GET /workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frameNumbers", () => {
        it('should retrieve compressed frame pixel data with multipart/related; type="application/octet-stream"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA.studyInstanceUid}/series/${TEST_DICOM_DATA.seriesInstanceUid}/instances/${TEST_DICOM_DATA.sopInstanceUid}/frames/1`,
                {
                    headers: {
                        accept: 'multipart/related; type="application/octet-stream"',
                    },
                },
            );

            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="application/octet-stream"',
            );
            const parts = multipartDecode(await response.arrayBuffer());
            expect(parts.length).toBe(1);
        });

        it('should retrieve uncompressed frame pixel data with multipart/related; type="application/octet-stream"', async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies/${TEST_DICOM_DATA_2.studyInstanceUid}/series/${TEST_DICOM_DATA_2.seriesInstanceUid}/instances/${TEST_DICOM_DATA_2.sopInstanceUid}/frames/1`,
                {
                    headers: {
                        accept: 'multipart/related; type="application/octet-stream"',
                    },
                },
            );

            // Assert
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain(
                'multipart/related; type="application/octet-stream"',
            );
            const parts = multipartDecode(await response.arrayBuffer());
            expect(parts.length).toBe(1);
        });
    });
});
