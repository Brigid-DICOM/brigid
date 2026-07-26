import { randomUUID } from "node:crypto";
import fs, { createReadStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Writable } from "node:stream";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import * as dcmjs from "dcmjs";
import dcmjsDimse from "dcmjs-dimse";
import fsE from "fs-extra";
import { StowRsService } from "../services/stowRs.service";
import type { MultipartFile } from "../types/file";
import { appLogger } from "../utils/logger";
import { dimseAeRegistry } from "./aeRegistry";
import { negotiatePresentationContext } from "./presentationContext";

const { DicomMetaDictionary, DicomDict } = dcmjs.data;
const { constants, responses, Scp } = dcmjsDimse;
const {
    RejectReason,
    RejectResult,
    RejectSource,
    Status,
    TransferSyntax,
} = constants;

const logger = appLogger.child({
    module: "BrigidDimseScp",
});

const NATIVE_FILE_PATH_TAG = "NATIVE_FILE_PATH";

export class BrigidDimseScp extends Scp {
    private association: dcmjsDimse.association.Association | null = null;
    private workspaceId: string | null = null;
    private readonly dimseTempDir = path.join(os.tmpdir(), "brigid-dimse");
    private readonly storeFilePathByStream = new WeakMap<Writable, string>();

    associationRequested(
        association: dcmjsDimse.association.Association,
    ): void {
        this.association = association;

        const calledAeTitle = association.getCalledAeTitle();
        const registryEntry = dimseAeRegistry.get(calledAeTitle);
        if (!registryEntry) {
            this.sendAssociationReject(
                RejectResult.Permanent,
                RejectSource.ServiceUser,
                RejectReason.CalledAeNotRecognized,
            );
            return;
        }

        this.workspaceId = registryEntry.workspaceId;
        association.setMaxPduLength(65536);

        const callingAeTitle = association.getCallingAeTitle();
        logger.info(
            `Association requested from ${callingAeTitle} to ${calledAeTitle}`,
            {
                workspaceId: registryEntry.workspaceId,
            },
        );

        for (const { id } of association.getPresentationContexts()) {
            const context = association.getPresentationContext(id);
            negotiatePresentationContext(
                context.getAbstractSyntaxUid(),
                context,
            );
        }

        this.sendAssociationAccept();
    }

    associationReleaseRequested(): void {
        this.sendAssociationReleaseResponse();
    }

    cEchoRequest(
        request: dcmjsDimse.requests.CEchoRequest,
        callback: (response: dcmjsDimse.responses.CEchoResponse) => void,
    ): void {
        const response = responses.CEchoResponse.fromRequest(request);
        response.setStatus(Status.Success);
        callback(response);
    }

    async cStoreRequest(
        request: dcmjsDimse.requests.CStoreRequest,
        callback: (response: dcmjsDimse.responses.CStoreResponse) => void,
    ): Promise<void> {
        const response = responses.CStoreResponse.fromRequest(request);
        const workspaceId = this.workspaceId;

        if (!workspaceId) {
            response.setStatus(Status.ProcessingFailure);
            callback(response);
            return;
        }

        try {
            const dataset = request.getDataset();
            if (!dataset) {
                throw new Error("C-STORE dataset is missing");
            }
            const part10FilePath = await this.mergeMetaAndDataset({
                dataset,
                sopClassUid: request.getAffectedSopClassUid(),
                sopInstanceUid: request.getAffectedSopInstanceUid(),
            });
            const multipartFile = await this.toMultipartFile(part10FilePath);
            const stowRsService = new StowRsService(workspaceId);
            const { message } = await stowRsService.storeDicomFiles([
                multipartFile,
            ]);

            if (message["00081198"].Value.length > 0) {
                throw new Error(
                    `Failed to store DICOM file, ${JSON.stringify(message["00081198"].Value)}`,
                );
            }

            response.setStatus(Status.Success);
            callback(response);
        } catch (error) {
            logger.error("Failed to store DICOM file", error, {
                op: "C-STORE",
                workspaceId,
            });
            response.setStatus(Status.ProcessingFailure);
            callback(response);
        }
    }

    createStoreWritableStream(
        _acceptedPresentationContext: dcmjsDimse.association.PresentationContext,
        _request: dcmjsDimse.requests.CStoreRequest,
    ): Writable {
        fs.mkdirSync(this.dimseTempDir, { recursive: true });
        const filePath = path.join(this.dimseTempDir, `${randomUUID()}.dcm`);
        const writeStream = fs.createWriteStream(filePath, { flags: "w" });
        this.storeFilePathByStream.set(writeStream, filePath);
        return writeStream;
    }

    createDatasetFromStoreWritableStream(
        writable: Writable,
        acceptedPresentationContext: dcmjsDimse.association.PresentationContext,
        callback: (dataset: dcmjsDimse.Dataset) => void,
    ): void {
        const filePath = this.storeFilePathByStream.get(writable);
        const acceptedTransferSyntaxUid =
            acceptedPresentationContext.getAcceptedTransferSyntaxUid();

        const fallbackDataset = new dcmjsDimse.Dataset(
            {
                isUndefined: true,
            },
            acceptedTransferSyntaxUid,
        );

        if (!filePath) {
            callback(fallbackDataset);
            return;
        }

        let done = false;
        const doneOnce = (dataset: dcmjsDimse.Dataset) => {
            if (done) {
                return;
            }
            done = true;
            callback(dataset);
        };

        writable.on("finish", () => {
            const dimseDataset = new dcmjsDimse.Dataset(
                {
                    isUndefined: true,
                },
                acceptedTransferSyntaxUid,
            );
            dimseDataset.setElement(NATIVE_FILE_PATH_TAG, filePath);
            doneOnce(dimseDataset);
        });

        writable.once("error", (error) => {
            logger.error("dimse writable error", error);
            callback(fallbackDataset);
        });
    }

    private async toMultipartFile(filePath: string): Promise<MultipartFile> {
        const stat = await fsE.stat(filePath);
        return {
            originalFilename: path.basename(filePath),
            filename: filePath,
            size: stat.size,
            mediaType: "application/dicom",
        };
    }

    private async mergeMetaAndDataset(options: {
        dataset: dcmjsDimse.Dataset;
        sopClassUid: string;
        sopInstanceUid: string;
    }) {
        const { dataset, sopClassUid, sopInstanceUid } = options;
        const datasetFile = dataset.getElement(NATIVE_FILE_PATH_TAG);
        if (!datasetFile) {
            throw new Error("C-STORE dataset is missing native file path");
        }

        const transferSyntaxUid =
            dataset.getTransferSyntaxUid() ??
            TransferSyntax.ImplicitVRLittleEndian;

        const meta = {
            FileMetaInformationVersion: new Uint8Array([0, 1]).buffer,
            MediaStorageSOPClassUID:
                dataset.getElement("SOPClassUID") ?? sopClassUid,
            MediaStorageSOPInstanceUID:
                dataset.getElement("SOPInstanceUID") ?? sopInstanceUid,
            TransferSyntaxUID: transferSyntaxUid,
            ImplementationClassUID:
                dcmjsDimse.Implementation.getImplementationClassUid(),
            ImplementationVersionName:
                dcmjsDimse.Implementation.getImplementationVersion(),
        };

        const denaturalizedMetaHeader =
            DicomMetaDictionary.denaturalizeDataset(meta);
        const metaDicomDict = new DicomDict(denaturalizedMetaHeader);
        const metaFilePath = path.join(
            this.dimseTempDir,
            `${randomUUID()}.meta.dcm`,
        );
        fs.writeFileSync(metaFilePath, Buffer.from(metaDicomDict.write({})));

        const outputFilePath = path.join(this.dimseTempDir, `${randomUUID()}.dcm`);

        const streams = [
            createReadStream(metaFilePath),
            createReadStream(datasetFile as string),
        ];

        async function* mergeStreams() {
            for (const stream of streams) {
                for await (const chunk of stream) {
                    yield chunk;
                }
            }
        }

        await pipeline(
            Readable.from(mergeStreams()),
            fs.createWriteStream(outputFilePath),
        );

        fs.unlinkSync(metaFilePath);

        return outputFilePath;
    }
}
