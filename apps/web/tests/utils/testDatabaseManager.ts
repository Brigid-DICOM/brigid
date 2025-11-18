import { PATIENT_SEX } from "@brigid/database/src/const/dicom";
import { AccountEntity } from "@brigid/database/src/entities/account.entity";
import { DicomCodeSequenceEntity } from "@brigid/database/src/entities/dicomCodeSequence.entity";
import { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import { PatientEntity } from "@brigid/database/src/entities/patient.entity";
import { PersonNameEntity } from "@brigid/database/src/entities/personName.entity";
import { SeriesEntity } from "@brigid/database/src/entities/series.entity";
import { SeriesRequestAttributesEntity } from "@brigid/database/src/entities/seriesRequestAttributes.entity";
import { SessionEntity } from "@brigid/database/src/entities/session.entity";
import { StudyEntity } from "@brigid/database/src/entities/study.entity";
import { TagEntity } from "@brigid/database/src/entities/tag.entity";
import { TagAssignmentEntity } from "@brigid/database/src/entities/tagAssignment.entity";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import { UserWorkspaceEntity } from "@brigid/database/src/entities/userWorkspace.entity";
import { VerificationTokenEntity } from "@brigid/database/src/entities/verificationToken.entity";
import { WorkspaceEntity } from "@brigid/database/src/entities/workspace.entity";
import * as SqliteDriver from "sqlite3";
import { DataSource } from "typeorm";
import { WorkspaceService } from "@/server/services/workspace.service";

export class TestDatabaseManager {
    public dataSource: DataSource;
    private isInitialized: boolean = false;

    constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            entities: [
                UserEntity,
                AccountEntity,
                SessionEntity,
                VerificationTokenEntity,
                WorkspaceEntity,
                UserWorkspaceEntity,
                PersonNameEntity,
                PatientEntity,
                StudyEntity,
                SeriesEntity,
                InstanceEntity,
                DicomCodeSequenceEntity,
                SeriesRequestAttributesEntity,
                TagEntity,
                TagAssignmentEntity,
            ],
            synchronize: true,
            logging: false,
            driver: SqliteDriver,
        });
    }

    async initialize() {
        if (!this.isInitialized) {
            await this.dataSource.initialize();
            this.isInitialized = true;
        }
    }

    async cleanup() {
        if (this.isInitialized) {
            await this.dataSource.destroy();
            this.isInitialized = false;
        }
    }

    async clearDatabase() {
        await this.dataSource.manager.clear(TagAssignmentEntity);
        await this.dataSource.manager.clear(TagEntity);
        await this.dataSource.manager.clear(InstanceEntity);
        await this.dataSource.manager.clear(SeriesEntity);
        await this.dataSource.manager.clear(StudyEntity);
        await this.dataSource.manager.clear(WorkspaceEntity);
    }

    async seedTestData() {
        const manager = this.dataSource.manager;

        // 1. 建立 Workspace create workspace
        const workspaceService = new WorkspaceService();
        const workspace = await workspaceService.getOrCreateSystemWorkspace();

        // 2. 建立 Patient 1 + PersonName create patient 1 + person name
        const patientName1 = await manager.save(PersonNameEntity, {
            alphabetic: "Doe^John",
            ideographic: null,
            phonetic: null,
        });

        const patient1Json = {
            "00100010": { vr: "PN", Value: [{ Alphabetic: "Doe^John" }] },
            "00100020": { vr: "LO", Value: ["P0001"] },
            "00100030": { vr: "DA", Value: ["19900101"] },
            "00100040": { vr: "CS", Value: ["M"] },
        };
        const patient1 = await manager.save(PatientEntity, {
            workspaceId: workspace.id,
            dicomPatientId: "P0001",
            patientNameId: patientName1.id,
            birthDate: "19900101",
            patientSex: PATIENT_SEX.MALE,
            json: JSON.stringify(patient1Json),
        });

        // 3. 建立 Patient 2 + PersonName create patient 2 + person name
        const patientName2 = await manager.save(PersonNameEntity, {
            alphabetic: "Smith^Jane",
            ideographic: null,
            phonetic: null,
        });

        const patient2Json = {
            "00100010": { vr: "PN", Value: [{ Alphabetic: "Smith^Jane" }] },
            "00100020": { vr: "LO", Value: ["P0002"] },
            "00100030": { vr: "DA", Value: ["19900615"] },
            "00100040": { vr: "CS", Value: ["F"] },
        };
        const patient2 = await manager.save(PatientEntity, {
            workspaceId: workspace.id,
            dicomPatientId: "P0002",
            patientNameId: patientName2.id,
            birthDate: "19900615",
            patientSex: PATIENT_SEX.FEMALE,
            json: JSON.stringify(patient2Json),
        });

        // 4. 建立 ReferringPhysicianName create referring physician name
        const referringPhysician1 = await manager.save(PersonNameEntity, {
            alphabetic: "Brown^Robert",
            ideographic: null,
            phonetic: null,
        });

        // 5. 建立 Study 1 (Patient 1, CT, 有醫師) create study 1 (patient 1, CT, with physician)
        const study1Json = {
            ...patient1Json,
            "0020000D": { vr: "UI", Value: ["1.2.3.4.5.1"] },
            "00080020": { vr: "DA", Value: ["20241017"] },
            "00080030": { vr: "TM", Value: ["143000.000000"] },
            "00080050": { vr: "SH", Value: ["ACC001"] },
            "00200010": { vr: "SH", Value: ["ST001"] },
            "00081030": { vr: "LO", Value: ["CT Chest with Contrast"] },
            "00080061": { vr: "CS", Value: ["CT"] },
            "00080090": {
                vr: "PN",
                Value: [{ Alphabetic: "Brown^Robert" }],
            },
            "00201206": { vr: "IS", Value: [2] },
            "00201208": { vr: "IS", Value: [150] },
        };

        const study1 = await manager.save(StudyEntity, {
            workspaceId: workspace.id,
            patientId: patient1.id,
            dicomPatientId: patient1.dicomPatientId,
            modalitiesInStudy: ["CT"],
            characterSet: "ISO_IR 192",
            studyInstanceUid: "1.2.3.4.5.1",
            studyDate: "20241017",
            studyTime: "143000.000000",
            accessionNumber: "ACC001",
            studyId: "ST001",
            studyDescription: "Study Description 1",
            studyPath: "/test/study1",
            referringPhysicianNameId: referringPhysician1.id,
            json: JSON.stringify(study1Json),
        });

        // 6. 建立 Study 2 (Patient 1, MR, 無醫師) create study 2 (patient 1, MR, no physician)
        const study2Json = {
            ...patient1Json,
            "0020000D": { vr: "UI", Value: ["1.2.3.4.5.2"] },
            "00080020": { vr: "DA", Value: ["20241018"] },
            "00080030": { vr: "TM", Value: ["150000.000000"] },
            "00080050": { vr: "SH", Value: ["ACC002"] },
            "00200010": { vr: "SH", Value: ["ST002"] },
            "00081030": { vr: "LO", Value: ["MR Brain"] },
            "00080061": { vr: "CS", Value: ["MR"] },
            "00201206": { vr: "IS", Value: [1] },
            "00201208": { vr: "IS", Value: [200] },
        };
        const study2 = await manager.save(StudyEntity, {
            workspaceId: workspace.id,
            patientId: patient1.id,
            dicomPatientId: patient1.dicomPatientId,
            modalitiesInStudy: ["MR"],
            characterSet: "ISO_IR 192",
            studyInstanceUid: "1.2.3.4.5.2",
            studyDate: "20241018",
            studyTime: "150000.000000",
            accessionNumber: "ACC002",
            studyId: "ST002",
            studyDescription: "Study Description 2",
            studyPath: "/test/study2",
            referringPhysicianNameId: null,
            json: JSON.stringify(study2Json),
        });

        // 7. 建立 Study 3 (Patient 2, CT) create study 3 (patient 2, CT)
        const study3Json = {
            ...patient2Json,
            "0020000D": { vr: "UI", Value: ["1.2.3.4.5.3"] },
            "00080020": { vr: "DA", Value: ["20241015"] },
            "00080030": { vr: "TM", Value: ["100000.000000"] },
            "00080050": { vr: "SH", Value: ["ACC003"] },
            "00200010": { vr: "SH", Value: ["ST003"] },
            "00081030": { vr: "LO", Value: ["CT Abdomen"] },
            "00080090": {
                vr: "PN",
                Value: [{ Alphabetic: "Brown^Robert" }],
            },
            "00080061": { vr: "CS", Value: ["CT"] },
            "00201206": { vr: "IS", Value: [1] },
            "00201208": { vr: "IS", Value: [100] },
        };
        const study3 = await manager.save(StudyEntity, {
            workspaceId: workspace.id,
            patientId: patient2.id,
            dicomPatientId: patient2.dicomPatientId,
            modalitiesInStudy: ["CT"],
            studyInstanceUid: "1.2.3.4.5.3",
            studyDate: "20241015",
            studyTime: "100000.000000",
            accessionNumber: "ACC003",
            studyId: "ST003",
            studyDescription: "CT Abdomen",
            characterSet: "ISO_IR 100",
            studyPath: "/test/study3",
            referringPhysicianNameId: referringPhysician1.id,
            json: JSON.stringify(study3Json),
        });

        // 8. 建立 Series for Study 1 create series for study 1
        const series1_1Json = {
            ...study1Json,
            "0020000E": { vr: "UI", Value: ["1.2.3.4.5.1.1"] },
            "00080060": { vr: "CS", Value: ["CT"] },
            "00080021": { vr: "DA", Value: ["20241017"] },
            "00080031": { vr: "TM", Value: ["143500.000000"] },
            "0008103E": { vr: "LO", Value: ["Chest Arterial Phase"] },
            "00200011": { vr: "IS", Value: [1] },
            "00400244": { vr: "DA", Value: ["20241017"] },
            "00400245": { vr: "TM", Value: ["143500.000000"] },
            "00400275": {
                vr: "SQ",
                Value: [
                    {
                        "0020000D": {
                            vr: "UI",
                            Value: [study1.studyInstanceUid],
                        },
                        "00080050": { vr: "SH", Value: ["REQACC001"] },
                        "00080051": {
                            vr: "SQ",
                            Value: [
                                {
                                    "00400031": {
                                        vr: "LO",
                                        Value: ["Local Entity ID 1"],
                                    },
                                    "00400032": {
                                        vr: "LO",
                                        Value: [
                                            "054453f4-805f-48f2-b5ca-120d64b809fb",
                                        ],
                                    },
                                    "00400033": { vr: "LO", Value: ["UUID"] },
                                },
                            ],
                        },
                        "00401001": { vr: "SH", Value: ["SPS-1"] },
                        "00400009": { vr: "SH", Value: ["RP-1"] },
                    },
                ],
            },
        };

        const series1_1 = await manager.save(SeriesEntity, {
            workspaceId: workspace.id,
            localStudyId: study1.id,
            studyInstanceUid: study1.studyInstanceUid,
            seriesInstanceUid: "1.2.3.4.5.1.1",
            seriesDate: "20241017",
            seriesTime: "143500.000000",
            modality: "CT",
            seriesDescription: "Chest Arterial Phase",
            seriesNumber: 1,
            performedProcedureStepStartDate: "20241017",
            performedProcedureStepStartTime: "143500.000000",
            seriesRequestAttributes: {
                studyInstanceUid: study1.studyInstanceUid,
                accessionNumber: "REQACC001",
                accLocalNamespaceEntityId: "LOCAL_ENTITY_ID_1",
                accUniversalEntityId: "054453f4-805f-48f2-b5ca-120d64b809fb",
                accUniversalEntityIdType: "UUID",
                requestedProcedureId: "RP-1",
                scheduledProcedureStepId: "SPS-1",
            },
            seriesPath: "/test/series1_1",
            json: JSON.stringify(series1_1Json),
        });

        const series1_2Json = {
            ...study1Json,
            "0020000E": { vr: "UI", Value: ["1.2.3.4.5.1.2"] },
            "00080060": { vr: "CS", Value: ["CT"] },
            "00080021": { vr: "DA", Value: ["20241017"] },
            "00080031": { vr: "TM", Value: ["144000.000000"] },
            "0008103E": { vr: "LO", Value: ["Chest Venous Phase"] },
            "00200011": { vr: "IS", Value: [2] },
            "00400244": { vr: "DA", Value: ["20241017"] },
            "00400245": { vr: "TM", Value: ["144000.000000"] },
            "00400275": {
                vr: "SQ",
                Value: [
                    {
                        "0020000D": {
                            vr: "UI",
                            Value: [study1.studyInstanceUid],
                        },
                        "00080050": { vr: "SH", Value: ["REQACC002"] },
                        "00080051": {
                            vr: "SQ",
                            Value: [
                                {
                                    "00400031": {
                                        vr: "LO",
                                        Value: ["Local Entity ID 2"],
                                    },
                                    "00400032": {
                                        vr: "LO",
                                        Value: [
                                            "2f6316f6-0d26-4f17-b5b4-0d296673da0c",
                                        ],
                                    },
                                    "00400033": { vr: "LO", Value: ["UUID"] },
                                },
                            ],
                        },
                        "00401001": { vr: "SH", Value: ["SPS-2"] },
                        "00400009": { vr: "SH", Value: ["RP-2"] },
                    },
                ],
            },
        };
        const series1_2 = await manager.save(SeriesEntity, {
            workspaceId: workspace.id,
            localStudyId: study1.id,
            studyInstanceUid: study1.studyInstanceUid,
            seriesInstanceUid: "1.2.3.4.5.1.2",
            seriesDate: "20241017",
            seriesTime: "144000.000000",
            modality: "CT",
            seriesDescription: "Chest Venous Phase",
            seriesNumber: 2,
            performedProcedureStepStartDate: "20241017",
            performedProcedureStepStartTime: "144000.000000",
            seriesRequestAttributes: {
                studyInstanceUid: study1.studyInstanceUid,
                accessionNumber: "REQACC002",
                accLocalNamespaceEntityId: "LOCAL_ENTITY_ID_2",
                accUniversalEntityId: "2f6316f6-0d26-4f17-b5b4-0d296673da0c",
                accUniversalEntityIdType: "UUID",
                requestedProcedureId: "RP-2",
                scheduledProcedureStepId: "SPS-2",
            },
            seriesPath: "/test/series1_2",
            json: JSON.stringify(series1_2Json),
        });

        // 9. create series for study 2
        const series2_1Json = {
            ...study2Json,
            "0020000E": { vr: "UI", Value: ["1.2.3.4.5.2.1"] },
            "00080060": { vr: "CS", Value: ["MR"] },
            "00080021": { vr: "DA", Value: ["20241018"] },
            "00080031": { vr: "TM", Value: ["150500.000000"] },
            "0008103E": { vr: "LO", Value: ["T1 Axial"] },
            "00200011": { vr: "IS", Value: [1] },
        };
        const series2_1 = await manager.save(SeriesEntity, {
            workspaceId: workspace.id,
            localStudyId: study2.id,
            studyInstanceUid: study2.studyInstanceUid,
            seriesInstanceUid: "1.2.3.4.5.2.1",
            seriesDate: "20241018",
            seriesTime: "150500.000000",
            modality: "MR",
            seriesDescription: "T1 Axial",
            seriesNumber: 1,
            seriesPath: "/test/series2_1",
            json: JSON.stringify(series2_1Json),
        });

        // 10. create series for study 3
        const series3_1Json = {
            ...study3Json,
            "0020000E": { vr: "UI", Value: ["1.2.3.4.5.3.1"] },
            "00080060": { vr: "CS", Value: ["CT"] },
            "00080021": { vr: "DA", Value: ["20241015"] },
            "00080031": { vr: "TM", Value: ["100500.000000"] },
            "0008103E": { vr: "LO", Value: ["Abdomen Portal Venous"] },
            "00200011": { vr: "IS", Value: [1] },
        };
        const series3_1 = await manager.save(SeriesEntity, {
            workspaceId: workspace.id,
            localStudyId: study3.id,
            studyInstanceUid: study3.studyInstanceUid,
            seriesInstanceUid: "1.2.3.4.5.3.1",
            seriesDate: "20241015",
            seriesTime: "100500.000000",
            modality: "CT",
            seriesDescription: "Abdomen Portal Venous",
            seriesNumber: 1,
            seriesPath: "/test/series3_1",
            json: JSON.stringify(series3_1Json),
        });

        // 11. create instance for series 1_1
        const instance1_1_1Json = {
            ...series1_1Json,
            "00080016": { vr: "UI", Value: ["1.2.840.113619.5.1"] },
            "00080018": { vr: "UI", Value: ["1.2.840.113619.5.1.1"] },
            "00080022": { vr: "DA", Value: ["20241017"] },
            "0008002A": { vr: "DT", Value: ["20241017143500.000000"] },
            "00080023": { vr: "DA", Value: ["20241017"] },
            "00080033": { vr: "TM", Value: ["150500.000000"] },
            "00200013": { vr: "IS", Value: [1] },
            "00280008": { vr: "IS", Value: [1] },
            "00281050": { vr: "DS", Value: ["100"] },
            "00281051": { vr: "DS", Value: ["100"] },
            "0040A491": { vr: "CS", Value: ["COMPLETED"] },
            "0040A493": { vr: "CS", Value: ["VERIFIED"] },
        };
        const instance1_1_1 = await manager.save(InstanceEntity, {
            workspaceId: workspace.id,
            localSeriesId: series1_1.id,
            instancePath: "/test/instance1_1_1",
            transferSyntaxUid: "1.2.840.113619.5.1",
            studyInstanceUid: study1.studyInstanceUid,
            seriesInstanceUid: series1_1.seriesInstanceUid,
            sopClassUid: "1.2.840.113619.5.1",
            sopInstanceUid: "1.2.840.113619.5.1.1",
            acquisitionDate: "20241017",
            acquisitionDateTime: "20241017143500.000000",
            contentDate: "20241017",
            contentTime: "150500.000000",
            instanceNumber: 1,
            numberOfFrames: 1,
            windowCenter: "100",
            windowWidth: "100",
            completionFlag: "COMPLETED",
            verificationFlag: "VERIFIED",
            json: JSON.stringify(instance1_1_1Json),
        });

        const instance1_2_1Json = {
            ...series1_2Json,
            "00080016": { vr: "UI", Value: ["1.2.840.113619.5.1"] },
            "00080018": { vr: "UI", Value: ["1.2.840.113619.5.1.2"] },
            "00080022": { vr: "DA", Value: ["20241017"] },
            "0008002A": { vr: "DT", Value: ["20241017143500.000000"] },
            "00080023": { vr: "DA", Value: ["20241017"] },
            "00080033": { vr: "TM", Value: ["150500.000000"] },
            "00200013": { vr: "IS", Value: [1] },
            "00280008": { vr: "IS", Value: [1] },
            "00281050": { vr: "DS", Value: ["100"] },
            "00281051": { vr: "DS", Value: ["100"] },
            "0040A491": { vr: "CS", Value: ["COMPLETED"] },
            "0040A493": { vr: "CS", Value: ["VERIFIED"] },
        };
        const instance1_2_1 = await manager.save(InstanceEntity, {
            workspaceId: workspace.id,
            localSeriesId: series1_2.id,
            instancePath: "/test/instance1_1_2",
            transferSyntaxUid: "1.2.840.113619.5.1",
            studyInstanceUid: study1.studyInstanceUid,
            seriesInstanceUid: series1_2.seriesInstanceUid,
            sopClassUid: "1.2.840.113619.5.1",
            sopInstanceUid: "1.2.840.113619.5.1.2",
            acquisitionDate: "20241017",
            acquisitionDateTime: "20241017143500.000000",
            contentDate: "20241017",
            contentTime: "144000.000000",
            instanceNumber: 1,
            numberOfFrames: 1,
            windowCenter: "100",
            windowWidth: "100",
            completionFlag: "COMPLETED",
            verificationFlag: "VERIFIED",
            json: JSON.stringify(instance1_2_1Json),
        });

        const instance2_1_1Json = {
            ...series2_1Json,
            "00080016": { vr: "UI", Value: ["1.2.840.113619.5.1"] },
            "00080018": { vr: "UI", Value: ["1.2.840.113619.5.2.1"] },
            "00080022": { vr: "DA", Value: ["20241018"] },
            "0008002A": { vr: "DT", Value: ["20241018150500.000000"] },
            "00080023": { vr: "DA", Value: ["20241018"] },
            "00080033": { vr: "TM", Value: ["150500.000000"] },
            "00200013": { vr: "IS", Value: [1] },
            "00280008": { vr: "IS", Value: [1] },
            "00281050": { vr: "DS", Value: ["100"] },
            "00281051": { vr: "DS", Value: ["100"] },
            "0040A491": { vr: "CS", Value: ["COMPLETED"] },
            "0040A493": { vr: "CS", Value: ["VERIFIED"] },
        };
        const instance2_1_1 = await manager.save(InstanceEntity, {
            workspaceId: workspace.id,
            localSeriesId: series2_1.id,
            instancePath: "/test/instance2_1_1",
            transferSyntaxUid: "1.2.840.113619.5.1",
            studyInstanceUid: study2.studyInstanceUid,
            seriesInstanceUid: series2_1.seriesInstanceUid,
            sopClassUid: "1.2.840.113619.5.1",
            sopInstanceUid: "1.2.840.113619.5.2.1",
            acquisitionDate: "20241018",
            acquisitionDateTime: "20241018150500.000000",
            contentDate: "20241018",
            contentTime: "150500.000000",
            instanceNumber: 1,
            numberOfFrames: 1,
            windowCenter: "100",
            windowWidth: "100",
            completionFlag: "COMPLETED",
            verificationFlag: "VERIFIED",
            json: JSON.stringify(instance2_1_1Json),
        });

        const instance3_1_1Json = {
            ...series3_1Json,
            "00080016": { vr: "UI", Value: ["1.2.840.113619.5.1"] },
            "00080018": { vr: "UI", Value: ["1.2.840.113619.5.3.1"] },
            "00080022": { vr: "DA", Value: ["20241015"] },
            "0008002A": { vr: "DT", Value: ["20241015100500.000000"] },
            "00080023": { vr: "DA", Value: ["20241015"] },
            "00080033": { vr: "TM", Value: ["100500.000000"] },
            "00200013": { vr: "IS", Value: [1] },
            "00280008": { vr: "IS", Value: [1] },
            "00281050": { vr: "DS", Value: ["100"] },
            "00281051": { vr: "DS", Value: ["100"] },
            "0040A491": { vr: "CS", Value: ["COMPLETED"] },
            "0040A493": { vr: "CS", Value: ["VERIFIED"] },
        };
        const instance3_1_1 = await manager.save(InstanceEntity, {
            workspaceId: workspace.id,
            localSeriesId: series3_1.id,
            instancePath: "/test/instance3_1_1",
            transferSyntaxUid: "1.2.840.113619.5.1",
            studyInstanceUid: study3.studyInstanceUid,
            seriesInstanceUid: series3_1.seriesInstanceUid,
            sopClassUid: "1.2.840.113619.5.1",
            sopInstanceUid: "1.2.840.113619.5.3.1",
            acquisitionDate: "20241015",
            acquisitionDateTime: "20241015100500.000000",
            contentDate: "20241015",
            contentTime: "100500.000000",
            instanceNumber: 1,
            numberOfFrames: 1,
            windowCenter: "100",
            windowWidth: "100",
            completionFlag: "COMPLETED",
            verificationFlag: "VERIFIED",
            json: JSON.stringify(instance3_1_1Json),
        });

        return {
            workspace,
            patients: [patient1, patient2],
            patientNames: [patientName1, patientName2],
            referringPhysicians: [referringPhysician1],
            studies: [study1, study2, study3],
            series: [series1_1, series1_2, series2_1, series3_1],
            instances: [
                instance1_1_1,
                instance1_2_1,
                instance2_1_1,
                instance3_1_1,
            ],
        };
    }

    async getStudies(workspaceId: string) {
        return await this.dataSource.manager.find(StudyEntity, {
            where: {
                workspaceId: workspaceId,
            },
        });
    }

    async getSeries(workspaceId: string) {
        return await this.dataSource.manager.find(SeriesEntity, {
            where: {
                workspaceId: workspaceId,
            },
        });
    }

    async getInstances(workspaceId: string) {
        return await this.dataSource.manager.find(InstanceEntity, {
            where: {
                workspaceId: workspaceId,
            },
        });
    }
}
