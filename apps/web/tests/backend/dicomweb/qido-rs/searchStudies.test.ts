import type { StudyEntity } from "@brigid/database/src/entities/study.entity";
import type { DataSource } from "typeorm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "@/app/api/[...route]/route";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import { TestDatabaseManager } from "../../../utils/testDatabaseManager";
import { WORKSPACE_ID } from "../../workspace.const";

declare global {
    function setTestDataSource(dataSource: DataSource): void;
}

describe("QIDO-RS Search Studies Route", () => {
    let testDb: TestDatabaseManager;
    let testStudies: StudyEntity[];

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
    });

    describe("GET /workspaces/:workspaceId/studies", () => {
        describe("basic queries", () => {
            it("should return all studies", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(3);
            });

            it("should return 404 for non-existent workspace", async () => {
                const nonExistentWorkspaceId = "non-existent-workspace-id";

                const response = await app.request(
                    `/api/workspaces/${nonExistentWorkspaceId}/studies`,
                );

                expect(response.status).toBe(404);
            });

            it("should return DICOM JSON format", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies`,
                );

                const studies = await response.json();
                expect(studies[0]).toHaveProperty("0020000D"); // Study Instance UID
                expect(studies[0]).toHaveProperty("00100020"); // Patient ID
            });
        });

        describe("parameter validation", () => {
            it("should accept limit parameter", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?limit=5`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBeLessThanOrEqual(5);
            });
            it("should reject invalid limit parameter", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?limit=0`,
                );

                expect(response.status).toBe(400);
            });
            it("should reject limit exceeding max", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?limit=1001`,
                );

                expect(response.status).toBe(400);
            });

            it("should accept offset parameter", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?offset=1`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });
            it("should reject negative offset parameter", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?offset=-1`,
                );

                expect(response.status).toBe(400);
            });
        });

        describe("PatientID queries", () => {
            it("should query by PatientID keyword", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientID=P0001`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) => study["00100020"].Value[0] === "P0001",
                    ),
                ).toBe(true);
            });

            it("should query by PatientID tag", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag}=P0001`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) => study["00100020"].Value[0] === "P0001",
                    ),
                ).toBe(true);
            });

            it("should support wildcard", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientID=P00*`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00100020"].Value[0].startsWith("P00"),
                    ),
                ).toBe(true);
            });

            it("should support ? wildcard", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientID=P000?`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00100020"].Value[0].startsWith("P000") &&
                            study["00100020"].Value[0].length === 5,
                    ),
                ).toBe(true);
            });

            it("should support multi-value queries", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientID=P0001,P0002`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00100020"].Value[0] === "P0001" ||
                            study["00100020"].Value[0] === "P0002",
                    ),
                ).toBe(true);
            });

            it("should support escaped commas", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientID=P0001\\,P0002`,
                );

                expect(response.status).toBe(204);
            });
        });

        describe("StudyInstanceUID queries", () => {
            it("should query by StudyInstanceUID keyword", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyInstanceUID=${testStudy.studyInstanceUid}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["0020000D"].Value[0]).toBe(
                    testStudy.studyInstanceUid,
                );
            });

            it("should support UID wildcard", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyInstanceUID=${testStudy.studyInstanceUid.slice(0, -1)}*`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["0020000D"].Value[0].startsWith(
                            testStudy.studyInstanceUid.slice(0, -1),
                        ),
                    ),
                ).toBe(true);
            });

            it("should support multiple UIDs", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyInstanceUID=${testStudies[0].studyInstanceUid},${testStudies[1].studyInstanceUid}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });
        });

        describe("StudyDate queries", () => {
            it("should query by StudyDate tag", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.StudyDate.tag}=${testStudy.studyDate}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080020"].Value[0]).toBe(
                    testStudy.studyDate,
                );
            });

            it("should query by exact date", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyDate=${testStudy.studyDate}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080020"].Value[0]).toBe(
                    testStudy.studyDate,
                );
            });

            it("should support date ranges", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyDate=20240101-20241017`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });

            it("should support start date", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyDate=20240101-`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(3);
            });

            it("should support end date", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyDate=-20241017`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });
        });

        describe("StudyTime queries", () => {
            it("should query by exact time", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=${testStudy.studyTime}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080030"].Value[0]).toBe(
                    testStudy.studyTime,
                );
            });

            it("should query by StudyTime tag", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.StudyTime.tag}=${testStudy.studyTime}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080030"].Value[0]).toBe(
                    testStudy.studyTime,
                );
            });

            it("should support time ranges", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=000000-143000`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });

            it("should support start time", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=143000-`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });

            it("should support end time", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=-143000`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });

            it("should handle time with milliseconds", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=143000.000000-143000.999999`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
            });
        });

        describe("AccessionNumber queries", () => {
            it("should query by AccessionNumber keyword", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?AccessionNumber=${testStudy.accessionNumber}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080050"].Value[0]).toBe(
                    testStudy.accessionNumber,
                );
            });

            it("should query by AccessionNumber tag", async () => {
                const testStudy = testStudies[0];
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.AccessionNumber.tag}=${testStudy.accessionNumber}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00080050"].Value[0]).toBe(
                    testStudy.accessionNumber,
                );
            });

            it("should support multiple accession numbers", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?AccessionNumber=${testStudies[0].accessionNumber},${testStudies[1].accessionNumber}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(2);
            });

            it("should support wildcard", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?AccessionNumber=ACC*`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00080050"].Value[0].startsWith("ACC"),
                    ),
                ).toBe(true);
            });
        });

        describe("ModalitiesInStudy queries", () => {
            it("should query by ModalitiesInStudy keyword", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?ModalitiesInStudy=CT`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00080061"].Value.includes("CT"),
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });

            it("should query by ModalitiesInStudy tag", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.ModalitiesInStudy.tag}=CT`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00080061"].Value.includes("CT"),
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });

            it("should support multiple modalities", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?ModalitiesInStudy=CT,MR`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00080061"].Value.includes("CT") ||
                            study["00080061"].Value.includes("MR"),
                    ),
                ).toBe(true);
                expect(studies.length).toBe(3);
            });

            it("should support wildcard", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?ModalitiesInStudy=C*`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00080061"].Value[0].startsWith("C"),
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });
        });

        describe("PatientName queries", () => {
            it("should query by PatientName keyword", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientName=Doe^John`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00100010"].Value[0].Alphabetic ===
                            "Doe^John",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });

            it("should query by PatientName tag", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.PatientName.tag}=Doe^John`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00100010"].Value[0].Alphabetic ===
                            "Doe^John",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });

            it("should support wildcard", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?PatientName=Doe*`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every((study: any) =>
                        study["00100010"].Value[0].Alphabetic.startsWith("Doe"),
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });
        });

        describe("ReferringPhysicianName queries", () => {
            it("should query by ReferringPhysicianName keyword", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?ReferringPhysicianName=Brown^Robert`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00080090"].Value[0].Alphabetic ===
                            "Brown^Robert",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });

            it("should query by ReferringPhysicianName tag", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.ReferringPhysicianName.tag}=Brown^Robert`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) =>
                            study["00080090"].Value[0].Alphabetic ===
                            "Brown^Robert",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(2);
            });
        });

        describe("StudyID queries", () => {
            it("should query by StudyID keyword", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyID=ST001`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) => study["00200010"].Value[0] === "ST001",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(1);
            });

            it("should query by StudyID tag", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${DICOM_TAG_KEYWORD_REGISTRY.StudyID.tag}=ST001`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(
                    studies.every(
                        (study: any) => study["00200010"].Value[0] === "ST001",
                    ),
                ).toBe(true);
                expect(studies.length).toBe(1);
            });
        });

        describe("combined queries", () => {
            it("should combine multiple parameters", async () => {
                const queryParams = {
                    PatientID: "P0001",
                    StudyInstanceUID: "1.2.3.4.5.2",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00100020"].Value[0]).toBe("P0001");
                expect(studies[0]["0020000D"].Value[0]).toBe("1.2.3.4.5.2");
            });

            it("should handle complex combined parameters", async () => {
                const queryParams = {
                    PatientID: "P0001",
                    StudyDate: "20240101-20241017",
                    StudyTime: "000000-143000",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(200);
                const studies = await response.json();
                expect(studies.length).toBe(1);
                expect(studies[0]["00100020"].Value[0]).toBe("P0001");
                expect(studies[0]["00080020"].Value[0]).toBe("20241017");
                expect(studies[0]["00080030"].Value[0]).toBe("143000.000000");
            });

            it("should return empty for non-matching combinations", async () => {
                const queryParams = {
                    PatientID: "P0009",
                    StudyDate: "20240101-20241017",
                    StudyTime: "000000-143000",
                    AccessionNumber: "ACC004",
                };

                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?${new URLSearchParams(queryParams)}`,
                );

                expect(response.status).toBe(204);
            });
        });

        describe("edge cases", () => {
            it("should handle invalid date format", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyDate=20240101-20241017-20241018`,
                );

                expect(response.status).toBe(400);
            });

            it("should handle invalid time format", async () => {
                const response = await app.request(
                    `/api/workspaces/${WORKSPACE_ID}/studies?StudyTime=143000.000000-143000.999999-143000.000000-`,
                );

                expect(response.status).toBe(400);
            });
        });
    });
});
