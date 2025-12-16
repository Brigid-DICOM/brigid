import type { StatusCode as HttpStatusCode } from "hono/utils/http-status";
import { DICOM_STATUS } from "@/server/const/dicomStatus";
import type { MultipartFile } from "@/server/types/file";
import { DicomFileSaver } from "../utils/dicom/dicomFileSaver";
import { DicomJsonUtils } from "../utils/dicom/dicomJsonUtils";
import { parseFromFilename } from "./dicom/dicomJsonParser";
import { StowRsResponseMessage } from "./stowRsResponseMessage";

export class StowRsService {
    private readonly stowRsResponseMessage: StowRsResponseMessage;
    private readonly httpStatusCode: HttpStatusCode;

    constructor(private readonly workspaceId: string) {
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

            // store/upload dicom file to storage
            const dicomFileSaver = new DicomFileSaver(
                dicomJsonUtils,
                this.workspaceId,
            );
            const { storedFilePath } =
                await dicomFileSaver.saveDicomFileToStorage(file);
            await dicomFileSaver.saveToDb(storedFilePath);

            // TODO: 儲存 metadata 和 binary data

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

    private async getDicomJson(filename: string) {
        const dicomJson = await parseFromFilename(filename);
        return dicomJson;
    }
}
