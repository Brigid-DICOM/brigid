import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import type { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import type { StudyEntity } from "@brigid/database/src/entities/study.entity";
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
import { TagTestUtils } from "../../utils/tagTestUtils";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Tag Query for DICOM", () => {
    let testDb: TestDatabaseManager;
    let tagUtils: TagTestUtils;
    let testStudies: StudyEntity[];
    let testSeries: SeriesEntity[];
    let testInstances: InstanceEntity[];

    beforeAll(async () => {
        testDb = new TestDatabaseManager();
        await testDb.initialize();
        global.setTestDataSource(testDb.dataSource);
        tagUtils = new TagTestUtils(testDb.dataSource);
    });

    afterAll(async () => {
        await testDb.cleanup();
    });

    beforeEach(async () => {
        await testDb.clearDatabase();

        const seedData = await testDb.seedTestData();
        testStudies = seedData.studies;
        testSeries = seedData.series;
        testInstances = seedData.instances;
    });

    describe("GET study with tags", () => {
        it("should return studies with tags", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const studyId = testStudies[0].studyInstanceUid;

            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag.id,
                "study",
                studyId,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(1);
        });

        it("should return empty array if no tags are found", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(204);
        });

        it("should return studies with multiple tags", async () => {
            // Arrange
            const tag1 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const tag2 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Reviewed",
                "#35FF57",
            );

            const studyId1 = testStudies[0].studyInstanceUid;
            const studyId2 = testStudies[1].studyInstanceUid;
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag1.id,
                "study",
                studyId1,
            );
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag2.id,
                "study",
                studyId2,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/studies?tagName=Important,Reviewed`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(2);
        });
    });

    describe("GET series with tags", () => {
        it("should return series with tags", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const seriesId = testSeries[0].seriesInstanceUid;
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag.id,
                "series",
                seriesId,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/series?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(1);
        });

        it("should return empty array if no tags are found", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/series?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(204);
        });

        it("should return series with multiple tags", async () => {
            // Arrange
            const tag1 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const tag2 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Reviewed",
                "#35FF57",
            );

            const seriesId1 = testSeries[0].seriesInstanceUid;
            const seriesId2 = testSeries[1].seriesInstanceUid;
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag1.id,
                "series",
                seriesId1,
            );
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag2.id,
                "series",
                seriesId2,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/series?tagName=Important,Reviewed`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(2);
        });
    });

    describe("GET instance with tags", () => {
        it("should return instance with tags", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const instanceId = testInstances[0].sopInstanceUid;
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag.id,
                "instance",
                instanceId,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/instances?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(1);
        });

        it("should return empty array if no tags are found", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/instances?tagName=Important`,
                {
                    method: "GET",
                },
            );

            // Assert
            expect(response.status).toBe(204);
        });

        it("should return instance with multiple tags", async () => {
            // Arrange
            const tag1 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const tag2 = await tagUtils.createTag(
                WORKSPACE_ID,
                "Reviewed",
                "#35FF57",
            );
            const instanceId1 = testInstances[0].sopInstanceUid;
            const instanceId2 = testInstances[1].sopInstanceUid;
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag1.id,
                "instance",
                instanceId1,
            );
            await tagUtils.assignTag(
                WORKSPACE_ID,
                tag2.id,
                "instance",
                instanceId2,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/instances?tagName=Important,Reviewed`,
                {
                    method: "GET",
                },
            );
            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json).toHaveLength(2);
        });
    });
});