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
        const filePath = this.dicomJsonUtils.getFilePath({
            workspaceId: this.workspaceId
        });
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

        // 先在 transaction 外計算 hash，不要鎖住資料庫
        const instanceEntity = await toInstanceDbEntity(
            this.dicomJsonUtils,
            this.workspaceId,
            "", // 先傳空字串，後續再填入
            storedFilePath
        );

        const result = await AppDataSource.transaction(
            async (transactionalEntityManager) => {
                try {
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

                    instanceEntity.localSeriesId = series.id;
                    const instanceService = new InstanceService(
                        transactionalEntityManager
                    );
                    const instance =
                        await instanceService.insertOrUpdateInstance(
                            instanceEntity
                        );

                    return {
                        patient,
                        study,
                        series,
                        instance
                    };
                } catch (error) {
                    console.error("CRITICAL ERROR INSIDE TRANSACTION:", error);
                    throw error;
                }
            }
        );

        return result;
    }

    async saveToDbWithRetry(storedFilePath: string, maxRetries: number = 3) {
        let lastError: unknown;
        
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await this.saveToDb(storedFilePath);
            } catch (error) {
                lastError = error;
                if (this.isConflictError(error)) {
                    console.warn(
                        "Storing DICOM file to database failed with conflict error, retrying..."
                    );
                    const delay = Math.random() * 200 * (i + 1);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    }

    private isConflictError(error: unknown) {
        if (typeof error !== "object" || error === null) {
            return false;
        }

        const err = error as { code?: string; driveError?: { code?: string } };
        const code = err.code || err.driveError?.code;

        if (!code) return false;

        const conflictCodes = [
            "23505", // PostgresSQL: unique_violation
            "40P01", // PostgresSQL: deadlock_detected
            "ER_DUP_ENTRY", // MySQL: duplicate entry
            "701" // SQL Server: deadlock
        ];

        return conflictCodes.includes(code);
    }
}
