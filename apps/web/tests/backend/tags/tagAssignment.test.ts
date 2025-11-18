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
    it,
    vi,
} from "vitest";
import { app } from "@/app/api/[...route]/route";
import { TagTestUtils } from "../../utils/tagTestUtils";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("Tag Assignment Routes", () => {
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
        vi.clearAllMocks();
        vi.restoreAllMocks();
        await testDb.clearDatabase();

        const seedData = await testDb.seedTestData();
        testStudies = seedData.studies;
        testSeries = seedData.series;
        testInstances = seedData.instances;
    });

    describe("POST /workspaces/:workspaceId/tags/assign - Assign Tag", () => {
        it("should assign a tag to study successfully", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const studyId = testStudies[0].id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: tag.id,
                        targetType: "study",
                        targetId: studyId,
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
            expect(json.data).toBeDefined();
            expect(json.data.tagId).toBe(tag.id);
            expect(json.data.targetType).toBe("study");
            expect(json.data.targetId).toBe(studyId);
        });

        it("should assign tag to series successfully", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const seriesId = testSeries[0].id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: tag.id,
                        targetType: "series",
                        targetId: seriesId,
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
            expect(json.data).toBeDefined();
            expect(json.data.tagId).toBe(tag.id);
            expect(json.data.targetType).toBe("series");
            expect(json.data.targetId).toBe(seriesId);
        });

        it("should assign tag to instance successfully", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const instanceId = testInstances[0].id;

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: tag.id,
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
            expect(json.data).toBeDefined();
            expect(json.data.tagId).toBe(tag.id);
            expect(json.data.targetType).toBe("instance");
            expect(json.data.targetId).toBe(instanceId);
        });

        it("should return 404 if tag is not found", async () => {
            // Arrange
            const nonExistentTagId = "non-existent-tag-id";

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: nonExistentTagId,
                        targetType: "study",
                        targetId: testStudies[0].id,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
        });

        it("should return 404 if target is not found", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const nonExistentTargetId = "non-existent-target-id";

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: tag.id,
                        targetType: "study",
                        targetId: nonExistentTargetId,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
        });

        it("should reject invalid target type", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tags/assign`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        tagId: tag.id,
                        targetType: "invalid",
                        targetId: testStudies[0].id,
                    }),
                    headers: new Headers({
                        "Content-Type": "application/json",
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("DELETE /workspaces/:workspaceId/tag-assignments/:assignmentId - Remove Tag Assignment", () => {
        it("should remove tag assignment successfully", async () => {
            // Arrange
            const tag = await tagUtils.createTag(
                WORKSPACE_ID,
                "Important",
                "#FF5735",
            );
            const assignment = await tagUtils.assignTag(
                WORKSPACE_ID,
                tag.id,
                "study",
                testStudies[0].id,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tag-assignments/${assignment.id}`,
                {
                    method: "DELETE",
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
        });

        it("should return 404 if assignment is not found", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/tag-assignments/non-existent-assignment-id`,
                {
                    method: "DELETE",
                },
            );

            // Assert
            expect(response.status).toBe(404);
        });

        describe("GET /workspaces/:workspaceId/tag-assignments - Get All Tag Assignments", () => {
            it("should get all tags for study", async () => {
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
                const studyId = testStudies[0].id;

                await tagUtils.assignTag(
                    WORKSPACE_ID,
                    tag1.id,
                    "study",
                    studyId,
                );
                await tagUtils.assignTag(
                    WORKSPACE_ID,
                    tag2.id,
                    "study",
                    studyId,
                );

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/tags/study/${studyId}`,
                    {
                        method: "GET",
                    },
                );

                // Assert
                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data).toHaveLength(2);
                expect(json.data[0].id).toBe(tag1.id);
                expect(json.data[1].id).toBe(tag2.id);
            });

            it("should get tags for series", async () => {
                // Arrange
                const tag = await tagUtils.createTag(
                    WORKSPACE_ID,
                    "Important",
                    "#FF5735",
                );
                const seriesId = testSeries[0].id;

                await tagUtils.assignTag(
                    WORKSPACE_ID,
                    tag.id,
                    "series",
                    seriesId,
                );

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/tags/series/${seriesId}`,
                    {
                        method: "GET",
                    },
                );

                // aSSERT
                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data).toHaveLength(1);
            });

            it("should get tags for instance", async () => {
                // Arrange
                const tag = await tagUtils.createTag(
                    WORKSPACE_ID,
                    "Important",
                    "#FF5735",
                );
                const instanceId = testInstances[0].id;

                await tagUtils.assignTag(
                    WORKSPACE_ID,
                    tag.id,
                    "instance",
                    instanceId,
                );

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/tags/instance/${instanceId}`,
                    {
                        method: "GET",
                    },
                );

                // Assert
                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data).toHaveLength(1);
            });
        });
    });
});
