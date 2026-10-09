import type { StatusCode as HttpStatusCode } from "hono/utils/http-status";
import { DICOM_STATUS } from "@/server/const/dicomStatus";
import { RoutingJobService } from "@/server/routing/jobService";
import { RoutingRuleService } from "@/server/routing/ruleService";
import type { MultipartFile } from "@/server/types/file";
import { appLogger } from "@/server/utils/logger";
import { DicomFileSaver } from "../utils/dicom/dicomFileSaver";
import { DicomJsonUtils } from "../utils/dicom/dicomJsonUtils";
import { parseFromFilename } from "./dicom/dicomJsonParser";
import { StowRsResponseMessage } from "./stowRsResponseMessage";

const logger = appLogger.child({ module: "StowRsService" });

export class StowRsService {
    private readonly stowRsResponseMessage: StowRsResponseMessage;
    private readonly httpStatusCode: HttpStatusCode;

    constructor(
        private readonly workspaceId: string,
        private readonly callingAeTitle?: string,
    ) {
        this.stowRsResponseMessage = new StowRsResponseMessage(
            this.workspaceId,
        );
        this.httpStatusCode = 200;
    }

    async storeDicomFile(file: MultipartFile) {
        try {
            const dicomJson = await this.getDicomJson(file.filename);
            const dicomJsonUtils = new DicomJsonUtils(dicomJson);

            const {
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
                sopClassUid,
            } = dicomJsonUtils.getUidCollection();

            const dicomFileSaver = new DicomFileSaver(
                dicomJsonUtils,
                this.workspaceId,
            );
            const { storedFilePath } =
                await dicomFileSaver.saveDicomFileToStorage(file);
            await dicomFileSaver.saveToDbWithRetry(storedFilePath);

            await this.enqueueRoutingJobs({
                dicomJson,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
            });

            this.stowRsResponseMessage.addSuccessSopInstance({
                studyInstanceUid: studyInstanceUid,
                seriesInstanceUid: seriesInstanceUid,
                sopInstanceUid: sopInstanceUid,
                sopClassUid: sopClassUid,
            });
        } catch (error) {
            this.stowRsResponseMessage.addOtherFailureReason(
                DICOM_STATUS.ProcessingFailure.toString(),
            );
            console.error("Failed to store DICOM file", error);
            throw error;
        }
    }

    async storeDicomFiles(files: MultipartFile[]) {
        for (const file of files) {
            await this.storeDicomFile(file);
        }

        return {
            message: this.stowRsResponseMessage.getMessage(),
            httpStatusCode: this.httpStatusCode,
        };
    }

    private async enqueueRoutingJobs(options: {
        dicomJson: Awaited<ReturnType<StowRsService["getDicomJson"]>>;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        sopInstanceUid: string;
    }) {
        try {
            const rules = await new RoutingRuleService().listEnabled(
                this.workspaceId,
            );
            if (rules.length === 0) {
                return;
            }

            await new RoutingJobService().evaluateAndCreateJobs({
                workspaceId: this.workspaceId,
                dicomJson: options.dicomJson,
                studyInstanceUid: options.studyInstanceUid,
                seriesInstanceUid: options.seriesInstanceUid,
                sopInstanceUid: options.sopInstanceUid,
                rules,
                context: { callingAeTitle: this.callingAeTitle },
            });
        } catch (error) {
            logger.error("Failed to enqueue routing jobs after ingest", error);
        }
    }

    private async getDicomJson(filename: string) {
        const dicomJson = await parseFromFilename(filename);
        return dicomJson;
    }
}
