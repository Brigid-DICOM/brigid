import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { type DataSource, In, IsNull, Not } from "typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app/api/[...route]/route";
import { TestDatabaseManager } from "../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("DICOM Permanent Delete Operations", () => {
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

    describe("Instance Level Delete (RECYCLED -> DELETED)", () => {
        it("should mark recycled instances as deleted", async () => {
            // Arrange: 先 recycle instances
            const series = seedData.series[0];
            const instances = seedData.instances.filter(
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );
            const sopInstanceUids = instances.map(i => i.sopInstanceUid);

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
                }
            );

            // Act: Delete (RECYCLED -> DELETED)
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: sopInstanceUids,
                    }),
                }
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
                    }
                }
            );

            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
                expect(instance.deletedAt).not.toBeNull();
            }
        });

        it("should cascade delete empty series when all instances are deleted", async () => {
            // Arrange
            const series = seedData.series[0];
            const instances = seedData.instances.filter(
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );
            const sopInstanceUids = instances.map(i => i.sopInstanceUid);

            // Recycle then delete
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
                }
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: sopInstanceUids,
                    }),
                }
            );

            // Assert: series should be deleted
            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            
            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
            expect(updatedSeries?.deletedAt).not.toBeNull();
        });

        it("should not affect active instances when deleting recycled instances", async () => {
            const series = seedData.series[0];
            const study = seedData.studies[0];

            await testDb.dataSource.manager.save(InstanceEntity, {
                workspaceId: WORKSPACE_ID,
                localSeriesId: series.id,
                instancePath: "/test/instance_active",
                transferSyntaxUid: "1.2.840.113619.5.1",
                studyInstanceUid: study.studyInstanceUid,
                seriesInstanceUid: series.seriesInstanceUid,
                sopClassUid: "1.2.840.113619.5.1",
                sopInstanceUid: "1.2.840.113619.5.1.999",
                instanceNumber: 999,
                json: JSON.stringify({}),
            });

            const firstInstance = seedData.instances.find(
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );

            // Recycle first instance
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [firstInstance?.sopInstanceUid],
                    }),
                }
            );

            // Act: Delete recycled instance
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [firstInstance?.sopInstanceUid],
                    }),
                }
            );

            // Assert: series should remain active (because there's an active instance)
            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.ACTIVE);
            expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(1);
        });

        it("should return 200 with 0 affected for active instances", async () => {
            // Act 嘗試 delete 一個 active 的 instance（應該失敗，因為只能 delete RECYCLED）
            const instance = seedData.instances[0];

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [instance.sopInstanceUid],
                    }),
                }
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(0);
        });
    });

    describe("Series Level Delete (RECYCLED -> DELETED)", () => {
        it("should mark recycled series and its instances as deleted", async () => {
            const series = seedData.series[0];
            
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: [series.seriesInstanceUid],
                    }),
                }
            );

            // Act: Delete Series
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: [series.seriesInstanceUid],
                    }),
                }
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);

            const updatedSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );

            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);

            const instances= await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );

            for (const instance of instances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
                expect(instance.deletedAt).not.toBeNull();
            }
        });

        it("should cascade delete to study wen all series are deleted", async () => {
            // Arrange
            const study = seedData.studies[0];
            const allSeries = seedData.series.filter(
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            const seriesInstanceUids = allSeries.map(s => s.seriesInstanceUid);

            // Recycle all Series
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: seriesInstanceUids,
                    }),
                }
            );

            // Act: Delete all Series
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        seriesIds: seriesInstanceUids,
                    }),
                }
            );

            // Assert
            const updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );

            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
            expect(updatedStudy?.deletedAt).not.toBeNull();
        });
    });

    describe("Study Level Delete (RECYCLED -> DELETED)", () => {
        it("should mark recycled study and all related series/instances as deleted", async () => {
            // Arrant
            const study = seedData.studies[0];
            const relatedSeries = seedData.series.filter(
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            const relatedInstances = seedData.instances.filter(
                i => i.studyInstanceUid === study.studyInstanceUid
            );

            // Recycle Study
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
                }
            );

            // Act: Delete Study
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studyIds: [study.studyInstanceUid],
                    }),
                }
            );

            // Assert
            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);

            // 驗證 study
            const updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);

            // 驗證所有 series
            const updatedSeries = await testDb.dataSource.manager.find(
                SeriesEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedSeries.length).toBe(relatedSeries.length);
            for (const series of updatedSeries) {
                expect(series.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
            }

            // 驗證所有 instances
            const updatedInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedInstances.length).toBe(relatedInstances.length);
            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
                expect(instance.deletedAt).not.toBeNull();
            }
        });
    });

    describe("Permanent Delete (Remove From Database)", () => {
        it("should permanently delete instances marked as deleted", async () => {
            const series = seedData.series[0];
            const instances = seedData.instances.filter(
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );
            const sopInstanceUids = instances.map(i => i.sopInstanceUid);

            // Step 1: Recycle
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: instances.map(i => i.sopInstanceUid),
                    }),
                }
            );

            // Step 2: Delete
            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: instances.map(i => i.sopInstanceUid),
                    }),
                }
            );

            // 修改 deletedAt 為過去的時間
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 31);

            await testDb.dataSource.manager.update(
                InstanceEntity,
                {
                    sopInstanceUid: In(sopInstanceUids),
                    workspaceId: WORKSPACE_ID,
                },
                {
                    deletedAt: pastDate,
                }
            );

            // Act: Permanent Delete
            const deleteService = new (await import("@/server/services/dicom/dicomDelete.service")).DicomDeleteService();
            const beforeDate = new Date();
            beforeDate.setDate(beforeDate.getDate() - 30);

            const result = await deleteService.permanentlyDeleteMarkedItems(WORKSPACE_ID, beforeDate);

            // Assert
            expect(result.deletedInstances).toBe(instances.length);
            expect(result.instancePaths).toHaveLength(instances.length);

            // 驗證 instances 已從 database 刪除
            const remainingInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        sopInstanceUid: In(sopInstanceUids),
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );

            expect(remainingInstances.length).toBe(0);

            // 驗證 empty series 也被清理
            const remainingSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );
            expect(remainingSeries).toBeNull();
        });

        it("should not delete instances if deletion date is too recent", async () => {
            // Arrange
            const instance = seedData.instances[0];

            // Recycle and delete
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
                }
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [instance.sopInstanceUid],
                    }),
                }
            );

            const deleteService = new (await import("@/server/services/dicom/dicomDelete.service")).DicomDeleteService();
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() - 31); // 檢查31天前的，但剛剛才刪除

            const result = await deleteService.permanentlyDeleteMarkedItems(WORKSPACE_ID, futureDate);

            // Assert: 應該沒有刪除任何東西
            expect(result.deletedInstances).toBe(0);

            // 驗證 instance 仍然存在
            const remainingInstances = await testDb.dataSource.manager.findOne(
                InstanceEntity,
                {
                    where: {
                        sopInstanceUid: instance.sopInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );
            expect(remainingInstances).not.toBeNull();
            expect(remainingInstances?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);
        });

        it("should cleanup empty series and studies when permanently deleting", async () => {
            // Arrange
            const study = seedData.studies[0];
            const allSeries = seedData.series.filter(
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            const allInstances = seedData.instances.filter(
                i => i.studyInstanceUid === study.studyInstanceUid
            );

            // Recycle and delete study
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
                }
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studyIds: [study.studyInstanceUid],
                    }),
                }
            );

            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 31);

            await testDb.dataSource.manager.update(
                InstanceEntity,
                {
                    studyInstanceUid: study.studyInstanceUid
                },
                {
                    deletedAt: pastDate,
                }
            );

            // Act: Permanent Delete
            const deleteService = new (await import("@/server/services/dicom/dicomDelete.service")).DicomDeleteService();
            const beforeDate = new Date();
            beforeDate.setDate(beforeDate.getDate() - 30);

            await deleteService.permanentlyDeleteMarkedItems(
                WORKSPACE_ID,
                beforeDate
            );

            // Assert
            const remainingInstance = await testDb.dataSource.manager.count(
                InstanceEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );
            expect(remainingInstance).toBe(0);

            const remainingSeries = await testDb.dataSource.manager.count(
                SeriesEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );
            expect(remainingSeries).toBe(0);

            const remainingStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    },
                }
            );
            expect(remainingStudy).toBeNull();
        });
    });

    describe("Edge Cases", () => {
        it("should handle empty array gracefully", async () => {
            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [],
                    }),
                }
            );

            // Assert
            expect(response.status).toBe(400);
        });

        it("should handle mixed status instances (only delete RECYCLED)", async () => {
            const instance1= seedData.instances[0];
            const instance2 = seedData.instances[1];

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [instance1.sopInstanceUid],
                    }),
                }
            );

            // Act: 嘗試 delete 兩個 instance (只有第一個會被 delete)
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/delete`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        instanceIds: [instance1.sopInstanceUid, instance2.sopInstanceUid],
                    }),
                }
            );

            expect(response.status).toBe(200);
            const json = await response.json();
            expect(json.ok).toBe(true);
            expect(json.data.affected).toBe(1);

            const updatedInstance = await testDb.dataSource.manager.findOne(
                InstanceEntity,
                {
                    where: {
                        sopInstanceUid: instance1.sopInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedInstance).not.toBeNull();
            expect(updatedInstance?.deleteStatus).toBe(DICOM_DELETE_STATUS.DELETED);

            const updatedInstance2 = await testDb.dataSource.manager.findOne(
                InstanceEntity,
                {
                    where: {
                        sopInstanceUid: instance2.sopInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );

            expect(updatedInstance2).not.toBeNull();
            expect(updatedInstance2?.deleteStatus).toBe(DICOM_DELETE_STATUS.ACTIVE);
        });
    });
});