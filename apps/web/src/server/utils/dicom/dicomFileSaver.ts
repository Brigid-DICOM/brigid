import { AppDataSource } from "@brigid/database";
import { InstanceService } from "@/server/services/instance.service";
import { PatientService } from "@/server/services/patient.service";
import { SeriesService } from "@/server/services/series.service";
import { StudyService } from "@/server/services/study.service";
import type { MultipartFile } from "@/server/types/file";
import { getStorageProvider } from "../storage/storageFactory";
import {
    toInstanceDbEntity,
    toPatientDbEntity,
    toSeriesDbEntity,
    toStudyDbEntity
} from "./dicomJsonDbMapper";
import type { DicomJsonUtils } from "./dicomJsonUtils";

export class DicomFileSaver {
    private readonly dicomJsonUtils: DicomJsonUtils;

    constructor(
        dicomJsonUtils: DicomJsonUtils,
        private readonly workspaceId: string
    ) {
        this.dicomJsonUtils = dicomJsonUtils;
    }

    async saveDicomFileToStorage(file: MultipartFile) {
        // save to storage
        const filePath = this.dicomJsonUtils.getFilePath({ workspaceId: this.workspaceId });
        const storageProvider = getStorageProvider();
        const { filePath: storedFilePath } = await storageProvider.uploadFile(
            file,
            filePath
        );

        return { storedFilePath };
    }

    async saveToDb(storedFilePath: string) {
        const patientEntity = toPatientDbEntity(
            this.dicomJsonUtils,
            this.workspaceId
        );

        const result = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                const patientService = new PatientService(
                    transactionalEntityManager
                );
                const patient = await patientService.insertOrUpdatePatient(
                    patientEntity
                );

                const studyEntity = toStudyDbEntity(
                    this.dicomJsonUtils,
                    this.workspaceId,
                    patient.id
                );

                const studyService = new StudyService(
                    transactionalEntityManager
                );
                const study = await studyService.insertOrUpdateStudy(
                    studyEntity
                );

                const seriesEntity = toSeriesDbEntity(
                    this.dicomJsonUtils,
                    this.workspaceId,
                    study.id
                );
                const seriesService = new SeriesService(
                    transactionalEntityManager
                );
                const series = await seriesService.insertOrUpdateSeries(
                    seriesEntity
                );

                const instanceEntity = await toInstanceDbEntity(
                    this.dicomJsonUtils,
                    this.workspaceId,
                    series.id,
                    storedFilePath
                );

                const instanceService = new InstanceService(
                    transactionalEntityManager
                );
                const instance = await instanceService.insertOrUpdateInstance(
                    instanceEntity
                );

                return {
                    patient,
                    study,
                    series,
                    instance
                };
            }
        );

        return result;
    }
}
