import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { In, type DataSource } from "typeorm";
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
                (i) => i.seriesInstanceUid === series.seriesInstanceUid
            );

            expect(instances.length).toBeGreaterThan(0);
            const sopInstanceUids = instances.map(i => i.sopInstanceUid);

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        instanceIds: sopInstanceUids
                    })
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
                    },
                }
            );

            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
                expect(instance.deletedAt).not.toBeNull();
            }

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
            expect(updatedSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
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
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );

            expect(firstInstance).toBeDefined();

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        instanceIds: [firstInstance?.sopInstanceUid]
                    })
                }
            );

            expect(response.status).toBe(200);

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
                }
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
                i => i.seriesInstanceUid === series.seriesInstanceUid
            );

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        seriesIds: [series.seriesInstanceUid]
                    })
                }
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
                    }
                }
            );

            expect(updatedSeries).not.toBeNull();
            expect(updatedSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
            expect(updatedSeries?.deletedAt).not.toBeNull();
            expect(updatedSeries?.numberOfSeriesRelatedInstances).toBe(0);

            // Verify all instances are also recycled
            const updatedInstances = await testDb.dataSource.manager.find(
                InstanceEntity,
                {
                    where: {
                        seriesInstanceUid: series.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );

            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
                expect(instance.deletedAt).not.toBeNull();
            }
        });

        it("should cascade to study deleteStatus when all series are recycled", async () => {
            // Arrange
            const study = seedData.studies[0];
            const allSeries = seedData.series.filter(
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            
            expect(allSeries.length).toBeGreaterThan(0);

            const seriesInstanceUids = allSeries.map(s => s.seriesInstanceUid);

            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/series/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        seriesIds: seriesInstanceUids
                    })
                }
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
                    }
                }
            );

            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
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
                }
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
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            const relatedInstances = seedData.instances.filter(
                i => i.studyInstanceUid === study.studyInstanceUid
            );

            expect(relatedSeries.length).toBeGreaterThan(0);
            expect(relatedInstances.length).toBeGreaterThan(0);

            // Act
            const response = await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/studies/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studyIds: [study.studyInstanceUid]
                    })
                }
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
                    }
                }
            );

            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
            expect(updatedStudy?.deletedAt).not.toBeNull();

            const updatedSeries = await testDb.dataSource.manager.find(
                SeriesEntity,
                {
                    where: {
                        localStudyId: study.id,
                        workspaceId: WORKSPACE_ID,
                    }
                }
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
                    }
                }
            );

            expect(updatedInstances.length).toBe(relatedInstances.length);
            for (const instance of updatedInstances) {
                expect(instance.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studyIds: [study1.studyInstanceUid, study2.studyInstanceUid]
                    })
                }
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
                        workspaceId: WORKSPACE_ID
                    }
                }
            );

            const recycleStudies = updatedStudies.filter(
                s => s.deleteStatus === DICOM_DELETE_STATUS.RECYCLED
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
                }
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
                s => s.studyInstanceUid === study.studyInstanceUid
            );
            const firstSeries = seriesInStudy[0];
            const instanceInSeries = seedData.instances.filter(
                i => i.seriesInstanceUid === firstSeries.seriesInstanceUid
            );

            await app.request(
                `/api/workspaces/${WORKSPACE_ID}/dicom/instances/recycle`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        instanceIds: instanceInSeries.map(i => i.sopInstanceUid)
                    })
                }
            );

            // Verify first series is recycled
            const updatedFirstSeries = await testDb.dataSource.manager.findOne(
                SeriesEntity,
                {
                    where: {
                        seriesInstanceUid: firstSeries.seriesInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedFirstSeries).not.toBeNull();
            expect(updatedFirstSeries?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);

            // Verify study is still active (has another active series)
            let updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        seriesIds: [secondSeries.seriesInstanceUid]
                    })
                }
            );

            updatedStudy = await testDb.dataSource.manager.findOne(
                StudyEntity,
                {
                    where: {
                        studyInstanceUid: study.studyInstanceUid,
                        workspaceId: WORKSPACE_ID,
                    }
                }
            );
            expect(updatedStudy).not.toBeNull();
            expect(updatedStudy?.deleteStatus).toBe(DICOM_DELETE_STATUS.RECYCLED);
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
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        instanceIds: []
                    })
                }
            );

            // Assert
            expect(response.status).toBe(400);
        })
    });
})