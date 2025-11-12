import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { type DataSource, In } from "typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("DICOM Delete Operations", () => {
    let testDb: TestDatabaseManager;
    let seedData: {
        studies: StudyEntity[];
        series: SeriesEntity[];
        instances: InstanceEntity[];
    };

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
        seedData = await testDb.seedTestData();
    });

    describe("Instance Level Deletion", () => {
        it("should recycle all instances and cascade to series deleteStatus", async () => {
            // Arrange
            const series = seedData.series[0];
            const instances = seedData.instances.filter(
                (i) => i.seriesInstanceUid === series.seriesInstanceUid,
            );

            expect(instances.length).toBeGreaterThan(0);
            const sopInstanceUids = instances.map((i) => i.sopInstanceUid);

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: sopInstanceUids,
                    }),
                },
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(instances.length);

            const updatedInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        sopInstanceUid: In(sopInstanceUids),
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
                expect(instance.deletedAt).not.toBeNull();
            }

            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );
            expect(updatedSeries?.deletedAt).not.toBeNull();
            expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(0);
        });

        it("should not cascade to series when some instances remain active", async () => {
            // Arrange
            const series = seedData.series[0];
            const study = seedData.studies[0];

            // Add a second instance to series1_1
            await testDb.dataSource.manager.save(InstanceEntity, {
                workspaceId: WORKSPACE_ID,
                localSeriesId: series.id,
                instancePath: "/test/instance_additional",
                transferSyntaxUid: "1.2.840.113619.5.1",
                studyInstanceUid: study.studyInstanceUid,
                seriesInstanceUid: series.seriesInstanceUid,
                sopClassUid: "1.2.840.113619.5.1",
                sopInstanceUid: "1.2.840.113619.5.1.999",
                instanceNumber: 999,
                json: JSON.stringify({}),
            });

            const firstInstance = seedData.instances.find(
                (i) => i.seriesInstanceUid === series.seriesInstanceUid,
            );

            expect(firstInstance).toBeDefined();

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [firstInstance?.sopInstanceUid],
                    }),
                },
            );

            expect(response.status).toBe(200);

            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.ACTIVE,
            );
            expect(updatedSeries?.deletedAt).toBeNull();
            expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(1);
        });

        it("should return 404 for non-existent instances", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: ["non-existent-sop-uid"],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
            const json = await response.json();
            expect(json.ok).toBe(false);
        });
    });

    describe("Series Level Deletion", () => {
        it("should recycle series and cascade to all instances", async () => {
            // Arrange
            const series = seedData.series[0];
            const instances = seedData.instances.filter(
                (i) => i.seriesInstanceUid === series.seriesInstanceUid,
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: [series.seriesInstanceUid],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(instances.length);

            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );
            expect(updatedSeries?.deletedAt).not.toBeNull();
            expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(0);

            // Verify all instances are also recycled
            const updatedInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
                expect(instance.deletedAt).not.toBeNull();
            }
        });

        it("should cascade to study deleteStatus when all series are recycled", async () => {
            // Arrange
            const study = seedData.studies[0];
            const allSeries = seedData.series.filter(
                (s) => s.studyInstanceUid === study.studyInstanceUid,
            );

            expect(allSeries.length).toBeGreaterThan(0);

            const seriesInstanceUids = allSeries.map(
                (s) => s.seriesInstanceUid,
            );

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: seriesInstanceUids,
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(2);

            const updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );
            expect(updatedStudy?.deletedAt).not.toBeNull();
            expect(updatedStudy?.numberOfStudyRelatedSeries).toBe(0);
            expect(updatedStudy?.numberOfStudyRelatedInstances).toBe(0);
        });

        it("should return 404 for non-existent series", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: ["non-existent-series-uid"],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
            const json = await response.json();
            expect(json.ok).toBe(false);
        });
    });

    describe("Study Level Deletion", () => {
        it("should recycle study and cascade to all series and instances", async () => {
            // Arrange
            const study = seedData.studies[0];
            const relatedSeries = seedData.series.filter(
                (s) => s.studyInstanceUid === study.studyInstanceUid,
            );
            const relatedInstances = seedData.instances.filter(
                (i) => i.studyInstanceUid === study.studyInstanceUid,
            );

            expect(relatedSeries.length).toBeGreaterThan(0);
            expect(relatedInstances.length).toBeGreaterThan(0);

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studyIds: [study.studyInstanceUid],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(1);

            const updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );
            expect(updatedStudy?.deletedAt).not.toBeNull();

            const updatedSeries = await testDb.dataSource.manager.find(
                SeriesEntity,
                {
                    where: {
                        localStudyId: study.id,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedSeries.length).toBe(relatedSeries.length);
            for (const series of updatedSeries) {
                expect(series.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
                expect(series.deletedAt).not.toBeNull();
            }

            const updatedInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            expect(updatedInstances.length).toBe(relatedInstances.length);
            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
                expect(instance.deletedAt).not.toBeNull();
            }
        });

        it("should recycle multiple studies independently", async () => {
            // Arrange
            const study1 = seedData.studies[0];
            const study2 = seedData.studies[1];

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studyIds: [
                            study1.studyInstanceUid,
                            study2.studyInstanceUid,
                        ],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(2);

            const updatedStudies = await testDb.dataSource.manager.find(
                StudyEntity,
                {
                    where: {
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );

            const recycleStudies = updatedStudies.filter(
                (s) => s.deleteStatus === DICOM_DELETE_STATUS.RECYCLED,
            );
            expect(recycleStudies.length).toBe(2);
        });

        it("should return 404 for non-existent studies", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studyIds: ["non-existent-study-uid"],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(404);
            const json = await response.json();
            expect(json.ok).toBe(false);
        });
    });

    describe("Cascading Behavior Comprehensive Tests", () => {
        it("should maintain referential integrity through all deletion levels", async () => {
            // Arrange
            const study = seedData.studies[0];
            const seriesInStudy = seedData.series.filter(
                (s) => s.studyInstanceUid === study.studyInstanceUid,
            );
            const firstSeries = seriesInStudy[0];
            const instanceInSeries = seedData.instances.filter(
                (i) => i.seriesInstanceUid === firstSeries.seriesInstanceUid,
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: instanceInSeries.map(
                            (i) => i.sopInstanceUid,
                        ),
                    }),
                },
            );

            // Verify first series is recycled
            const updatedFirstSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: firstSeries.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );
            expect(updatedFirstSeries).not.toBeNull();
            expect(updatedFirstSeries?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );

            // Verify study is still active (has another active series)
            let updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );
            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.ACTIVE);

            // Act 2 - Recycle remaining series
            const secondSeries = seriesInStudy[1];
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: [secondSeries.seriesInstanceUid],
                    }),
                },
            );

            updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                },
            );
            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(
                DICOM_DELETE_STATUS.RECYCLED,
            );
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty array gracefully", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [],
                    }),
                },
            );

            // Assert
            expect(response.status).toBe(400);
        });
    });

    describe("DICOM Delete Restore Operations", () => {
        describe("Instance Level Restore", () => {
            it("should restore recycled instances to active", async () => {
                const series = seedData.series[0];
                const instances = seedData.instances.filter(
                    (i) => i.seriesInstanceUid === series.seriesInstanceUid,
                );

                expect(instances.length).toBeGreaterThan(0);
                const sopInstanceUids = instances.map((i) => i.sopInstanceUid);

                // Recycle instances first
                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: sopInstanceUids,
                        }),
                    },
                );

                // Act: Restore instances
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: sopInstanceUids,
                        }),
                    },
                );

                // Assert
                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(instances.length);

                const restoredInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            sopInstanceUid: In(sopInstanceUids),
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const instance of restoredInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                    expect(instance.deletedAt).toBeNull();
                }
            });

            it("should restore series when all its instances are restored", async () => {
                // Arrange: 準備測試資料，確保 series 有多個 instances
                const series = seedData.series[0];
                const study = seedData.studies[0];
                const existingInstances = seedData.instances.filter(
                    (i) => i.seriesInstanceUid === series.seriesInstanceUid,
                );

                await testDb.dataSource.manager.save(InstanceEntity, {
                    workspaceId: WORKSPACE_ID,
                    localSeriesId: series.id,
                    instancePath: "/test/instance_restore_test_1",
                    transferSyntaxUid: "1.2.840.113619.5.1",
                    studyInstanceUid: study.studyInstanceUid,
                    seriesInstanceUid: series.seriesInstanceUid,
                    sopClassUid: "1.2.840.113619.5.1",
                    sopInstanceUid: "1.2.840.113619.5.1.9001",
                    instanceNumber: 9001,
                    json: JSON.stringify({}),
                });

                const allInstanceUids = [
                    ...existingInstances.map((i) => i.sopInstanceUid),
                    "1.2.840.113619.5.1.9001",
                ];

                const recycleResponse = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: allInstanceUids,
                        }),
                    },
                );

                expect(recycleResponse.status).toBe(200);

                let updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
                expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(0);

                // Act: Restore series
                const restoreResponse = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: allInstanceUids,
                        }),
                    },
                );

                // Assert
                expect(restoreResponse.status).toBe(200);
                const json = await restoreResponse.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(allInstanceUids.length);

                // 驗證所有 instances 都變回 Active
                const restoredInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            sopInstanceUid: In(allInstanceUids),
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const instance of restoredInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                    expect(instance.deletedAt).toBeNull();
                }

                updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedSeries).not.toBeNull();
                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(updatedSeries?.deletedAt).toBeNull();
                expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(
                    allInstanceUids.length,
                );
            });

            it("should restore series when only some instances are active", async () => {
                const series = seedData.series[0];
                const study = seedData.studies[0];
                const existingInstances = seedData.instances.filter(
                    (i) => i.seriesInstanceUid === series.seriesInstanceUid,
                );

                // 新增兩個額外的 instances
                await testDb.dataSource.manager.save(InstanceEntity, {
                    workspaceId: WORKSPACE_ID,
                    localSeriesId: series.id,
                    instancePath: "/test/instance_partial_1",
                    transferSyntaxUid: "1.2.840.113619.5.1",
                    studyInstanceUid: study.studyInstanceUid,
                    seriesInstanceUid: series.seriesInstanceUid,
                    sopClassUid: "1.2.840.113619.5.1",
                    sopInstanceUid: "1.2.840.113619.5.1.9002",
                    instanceNumber: 9002,
                    json: JSON.stringify({}),
                });

                await testDb.dataSource.manager.save(InstanceEntity, {
                    workspaceId: WORKSPACE_ID,
                    localSeriesId: series.id,
                    instancePath: "/test/instance_partial_2",
                    transferSyntaxUid: "1.2.840.113619.5.1",
                    studyInstanceUid: study.studyInstanceUid,
                    seriesInstanceUid: series.seriesInstanceUid,
                    sopClassUid: "1.2.840.113619.5.1",
                    sopInstanceUid: "1.2.840.113619.5.1.9003",
                    instanceNumber: 9003,
                    json: JSON.stringify({}),
                });

                const allInstanceUids = [
                    ...existingInstances.map((i) => i.sopInstanceUid),
                    "1.2.840.113619.5.1.9002",
                    "1.2.840.113619.5.1.9003",
                ];

                // Recycle all instances
                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: allInstanceUids,
                        }),
                    },
                );

                let updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedSeries).not.toBeNull();
                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
                expect(updatedSeries?.deletedAt).not.toBeNull();
                expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(0);

                // Act: 只 restore 部分 instances
                const partialInstanceUids = [allInstanceUids[0]];
                const restoreResponse = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: partialInstanceUids,
                        }),
                    },
                );

                expect(restoreResponse.status).toBe(200);

                const restoredInstance =
                    await testDb.dataSource.manager.findOne(InstanceEntity, {
                        where: {
                            sopInstanceUid: partialInstanceUids[0],
                            workspaceId: WORKSPACE_ID,
                        },
                    });
                expect(restoredInstance).not.toBeNull();
                expect(restoredInstance?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );

                updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedSeries).not.toBeNull();
                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(updatedSeries?.deletedAt).toBeNull();
                expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(1);
            });

            it("should return 404 for non-existent instances", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: ["non-existent-sop-uid"],
                        }),
                    },
                );

                expect(response.status).toBe(404);
                const json = await response.json();
                expect(json.ok).toBe(false);
            });

            it("should handle restoring already active instances gracefully", async () => {
                const instance = seedData.instances[0];

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [instance.sopInstanceUid],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(0);
            });
        });

        describe("Series Level Restore", () => {
            it("should restore recycled series and its instances", async () => {
                const series = seedData.series[0];

                const recycleResponse = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [series.seriesInstanceUid],
                        }),
                    },
                );
                expect(recycleResponse.status).toBe(200);

                let updatedInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const instance of updatedInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.RECYCLED,
                    );
                    expect(instance.deletedAt).not.toBeNull();
                }

                // Act
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [series.seriesInstanceUid],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);

                const updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedSeries).not.toBeNull();
                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(
                    updatedSeries?.numberOfSeriesRelatedInstances,
                ).toBeGreaterThan(0);

                updatedInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            seriesInstanceUid: series.seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const instance of updatedInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                    expect(instance.deletedAt).toBeNull();
                }
            });

            it("should restore study when series is restored", async () => {
                const study = seedData.studies[0];
                const seriesInStudy = seedData.series.filter(
                    (s) => s.studyInstanceUid === study.studyInstanceUid,
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                let updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedStudy).not.toBeNull();
                expect(updatedStudy?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [seriesInStudy[0].seriesInstanceUid],
                        }),
                    },
                );

                // Assert
                expect(response.status).toBe(200);

                const updatedSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid:
                                seriesInStudy[0].seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedSeries).not.toBeNull();
                expect(updatedSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );

                updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedStudy).not.toBeNull();
                expect(updatedStudy?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(
                    updatedStudy?.numberOfStudyRelatedSeries,
                ).toBeGreaterThan(0);
            });

            it("should update study counts when series is restored", async () => {
                const study = seedData.studies[0];
                const seriesInStudy = seedData.series.filter(
                    (s) => s.studyInstanceUid === study.studyInstanceUid,
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                // Act: Restore 一個 series
                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [seriesInStudy[0].seriesInstanceUid],
                        }),
                    },
                );

                // Assert
                const updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(updatedStudy).not.toBeNull();
                expect(updatedStudy?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(
                    updatedStudy?.numberOfStudyRelatedSeries,
                ).toBeGreaterThan(0);
                expect(
                    updatedStudy?.numberOfStudyRelatedInstances,
                ).toBeGreaterThan(0);
            });

            it("should return 404 for non-existent series", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: ["non-existent-series-uid"],
                        }),
                    },
                );

                expect(response.status).toBe(404);
                const json = await response.json();
                expect(json.ok).toBe(false);
            });

            it("should only restore recycled series", async () => {
                const series = seedData.series[0];

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [series.seriesInstanceUid],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(0);
            });
        });

        describe("Study Level Restore", () => {
            it("should restore recycled study and all related series and instances", async () => {
                const study = seedData.studies[0];
                const seriesInStudy = seedData.series.filter(
                    (s) => s.studyInstanceUid === study.studyInstanceUid,
                );
                const instancesInStudy = seedData.instances.filter(
                    (i) => i.studyInstanceUid === study.studyInstanceUid,
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                // Act: restore study
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(1);

                const updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedStudy).not.toBeNull();
                expect(updatedStudy?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
                expect(updatedStudy?.deletedAt).toBeNull();

                // 驗證所有 series 變回 Active
                const updatedSeries = await testDb.dataSource.manager.find(
                    SeriesEntity,
                    {
                        where: {
                            localStudyId: study.id,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedSeries.length).toBe(seriesInStudy.length);
                for (const series of updatedSeries) {
                    expect(series.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                    expect(series.deletedAt).toBeNull();
                }

                const updatedInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedInstances.length).toBe(instancesInStudy.length);
                for (const instance of updatedInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                    expect(instance.deletedAt).toBeNull();
                }
            });

            it("should restore multiple studies independently", async () => {
                const study1 = seedData.studies[0];
                const study2 = seedData.studies[1];

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [
                                study1.studyInstanceUid,
                                study2.studyInstanceUid,
                            ],
                        }),
                    },
                );

                // Act: restore two studies
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [
                                study1.studyInstanceUid,
                                study2.studyInstanceUid,
                            ],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(2);

                const restoredStudies = await testDb.dataSource.manager.find(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: In([
                                study1.studyInstanceUid,
                                study2.studyInstanceUid,
                            ]),
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const study of restoredStudies) {
                    expect(study.deleteStatus).toBe(DICOM_DELETE_STATUS.ACTIVE);
                    expect(study.deletedAt).toBeNull();
                }
            });

            it("should return 404 for non-existent studies", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: ["non-existent-study-uid"],
                        }),
                    },
                );

                expect(response.status).toBe(404);
                const json = await response.json();
                expect(json.ok).toBe(false);
            });

            it("should only restore recycled studies", async () => {
                const study = seedData.studies[0];

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(0);
            });
        });

        describe("Cascading Restore Behavior", () => {
            it("should cascade restore from instances to series to study", async () => {
                const study = seedData.studies[0];
                const seriesInStudy = seedData.series.filter(
                    (s) => s.studyInstanceUid === study.studyInstanceUid,
                );

                expect(seriesInStudy.length).toBeGreaterThanOrEqual(2);

                const series1 = seriesInStudy[0];
                const series2 = seriesInStudy[1];

                await testDb.dataSource.manager.save(InstanceEntity, {
                    workspaceId: WORKSPACE_ID,
                    localSeriesId: series1.id,
                    instancePath: "/test/cascade_instance_1",
                    transferSyntaxUid: "1.2.840.113619.5.1",
                    studyInstanceUid: study.studyInstanceUid,
                    seriesInstanceUid: series1.seriesInstanceUid,
                    sopClassUid: "1.2.840.113619.5.1",
                    sopInstanceUid: "1.2.840.113619.5.1.8001",
                    instanceNumber: 8001,
                    json: JSON.stringify({}),
                });

                await testDb.dataSource.manager.save(InstanceEntity, {
                    workspaceId: WORKSPACE_ID,
                    localSeriesId: series2.id,
                    instancePath: "/test/cascade_instance_2",
                    transferSyntaxUid: "1.2.840.113619.5.1",
                    studyInstanceUid: study.studyInstanceUid,
                    seriesInstanceUid: series2.seriesInstanceUid,
                    sopClassUid: "1.2.840.113619.5.1",
                    sopInstanceUid: "1.2.840.113619.5.1.8002",
                    instanceNumber: 8002,
                    json: JSON.stringify({}),
                });

                // Recycle study
                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                // Act: 逐步 restore instances
                const series1Instances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            localSeriesId: series1.id,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                const series2Instances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            localSeriesId: series2.id,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: series1Instances.map(
                                (i) => i.sopInstanceUid,
                            ),
                        }),
                    },
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: series2Instances.map(
                                (i) => i.sopInstanceUid,
                            ),
                        }),
                    },
                );

                // Assert
                // 1. 所有 instances 變回 Active
                const allInstances = await testDb.dataSource.manager.find(
                    InstanceEntity,
                    {
                        where: {
                            workspaceId: WORKSPACE_ID,
                            studyInstanceUid: study.studyInstanceUid,
                        },
                    },
                );

                for (const instance of allInstances) {
                    expect(instance.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                }

                const allSeries = await testDb.dataSource.manager.find(
                    SeriesEntity,
                    {
                        where: {
                            localStudyId: study.id,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                for (const series of allSeries) {
                    expect(series.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.ACTIVE,
                    );
                }

                const updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedStudy).not.toBeNull();
                expect(updatedStudy?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );
            });

            it("should maintain referential integrity through all restore levels", async () => {
                const study = seedData.studies[0];
                const seriesInStudy = seedData.series.filter(
                    (s) => s.studyInstanceUid === study.studyInstanceUid,
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            studyIds: [study.studyInstanceUid],
                        }),
                    },
                );

                // Act: 只 restore 一個 series
                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/series/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            seriesIds: [seriesInStudy[0].seriesInstanceUid],
                        }),
                    },
                );

                // Assert
                const restoredSeries = await testDb.dataSource.manager.findOne(
                    SeriesEntity,
                    {
                        where: {
                            seriesInstanceUid:
                                seriesInStudy[0].seriesInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );
                expect(restoredSeries).not.toBeNull();
                expect(restoredSeries?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.ACTIVE,
                );

                if (seriesInStudy.length > 1) {
                    const otherSeries = await testDb.dataSource.manager.findOne(
                        SeriesEntity,
                        {
                            where: {
                                seriesInstanceUid:
                                    seriesInStudy[1].seriesInstanceUid,
                                workspaceId: WORKSPACE_ID,
                            },
                        },
                    );
                    expect(otherSeries?.deleteStatus).toBe(
                        DICOM_DELETE_STATUS.RECYCLED,
                    );
                }

                const updatedStudy = await testDb.dataSource.manager.findOne(
                    StudyEntity,
                    {
                        where: {
                            studyInstanceUid: study.studyInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    },
                );

                expect(updatedStudy).not.toBeNull();
                expect(
                    updatedStudy?.numberOfStudyRelatedSeries,
                ).toBeGreaterThan(0);
                expect(updatedStudy?.numberOfStudyRelatedSeries).toBeLessThan(
                    seriesInStudy.length,
                );
            });
        });

        describe("Edge cases", () => {
            it("should handle empty array gracefully", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [],
                        }),
                    },
                );

                expect(response.status).toBe(400);
            });

            it("should handle duplicate instance IDs gracefully", async () => {
                const instance = seedData.instances[0];

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [instance.sopInstanceUid],
                        }),
                    },
                );

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [
                                instance.sopInstanceUid,
                                instance.sopInstanceUid,
                            ],
                        }),
                    },
                );

                expect(response.status).toBe(200);
                const json = await response.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(1);
            });

            it("should allow recycle after restore", async () => {
                const instance = seedData.instances[0];

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [instance.sopInstanceUid],
                        }),
                    },
                );

                await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/restore`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [instance.sopInstanceUid],
                        }),
                    },
                );

                // Act: recycle again
                const recycleResponse = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            instanceIds: [instance.sopInstanceUid],
                        }),
                    },
                );

                expect(recycleResponse.status).toBe(200);
                const json = await recycleResponse.json();
                expect(json.ok).toBe(true);
                expect(json.data.affected).toBe(1);

                const restoredInstance =
                    await testDb.dataSource.manager.findOne(InstanceEntity, {
                        where: {
                            sopInstanceUid: instance.sopInstanceUid,
                            workspaceId: WORKSPACE_ID,
                        },
                    });
                expect(restoredInstance).not.toBeNull();
                expect(restoredInstance?.deleteStatus).toBe(
                    DICOM_DELETE_STATUS.RECYCLED,
                );
            });
        });
    });
});
