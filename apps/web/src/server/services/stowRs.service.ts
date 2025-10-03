import type { StatusCode as HttpStatusCode } from "hono/utils/http-status";
import { DICOM_STATUS } from "@/server/const/dicomStatus";
import { DicomJsonUtils } from "../utils/dicom/dicomJsonUtils";
import { parseFromFilename } from "./dicom/dicomJsonParser";
import { StowRsResponseMessage } from "./stowRsResponseMessage";

export class StowRsService {
    private readonly stowRsResponseMessage: StowRsResponseMessage;
    private readonly httpStatusCode: HttpStatusCode;

    constructor(private readonly workspaceId: string) {
        this.stowRsResponseMessage = new StowRsResponseMessage(this.workspaceId);
        this.httpStatusCode = 200;
    }

    async storeDicomFile(file: {
        originalFilename: string;
        filename: string;
    }) {
        try {
            const dicomJson = await this.getDicomJson(file.filename);
            const dicomJsonUtils = new DicomJsonUtils(dicomJson);

            this.stowRsResponseMessage.addSuccessSopInstance({
                studyInstanceUid: dicomJsonUtils.getUidCollection().studyInstanceUid as string,
                seriesInstanceUid: dicomJsonUtils.getUidCollection().seriesInstanceUid as string,
                sopInstanceUid: dicomJsonUtils.getUidCollection().sopInstanceUid as string,
                sopClassUid: dicomJsonUtils.getUidCollection().sopClassUid as string
            });
        } catch(error) {
            this.stowRsResponseMessage.addOtherFailureReason(DICOM_STATUS.ProcessingFailure.toString());
            console.error("Failed to store DICOM file", error);
        }
    }

    async storeDicomFiles(files: {
        originalFilename: string;
        filename: string;
    }[]) {
        for (const file of files) {
            await this.storeDicomFile(file);
        }

        return {
            message: this.stowRsResponseMessage.getMessage(),
            httpStatusCode: this.httpStatusCode
        };
    }

    private async getDicomJson(filename: string) {
        const dicomJson = await parseFromFilename(filename);
        return dicomJson;
    }
}