import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import * as dcmjs from "dcmjs";

const { DicomDict, DicomMessage, DicomMetaDictionary } = dcmjs.data;

const TEMP_ROOT = path.join(os.tmpdir(), "brigid-stgcmt-fixtures");

function readPart10File(filePath: string): {
    meta: Record<string, unknown>;
    dataset: Record<string, unknown>;
} {
    const buffer = fs.readFileSync(filePath);
    const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
    );
    const dicomDict = DicomMessage.readFile(arrayBuffer);
    return {
        meta: DicomMetaDictionary.naturalizeDataset(dicomDict.meta),
        dataset: DicomMetaDictionary.naturalizeDataset(dicomDict.dict),
    };
}

export function createFixtureWithSopInstanceUid(
    sourcePath: string,
    sopInstanceUid: string,
): string {
    fs.mkdirSync(TEMP_ROOT, { recursive: true });
    const { meta, dataset } = readPart10File(sourcePath);
    dataset.SOPInstanceUID = sopInstanceUid;

    const transferSyntaxUid =
        typeof meta.TransferSyntaxUID === "string"
            ? meta.TransferSyntaxUID
            : "1.2.840.10008.1.2";

    const fileMeta = {
        FileMetaInformationVersion: new Uint8Array([0, 1]).buffer,
        MediaStorageSOPClassUID: dataset.SOPClassUID,
        MediaStorageSOPInstanceUID: sopInstanceUid,
        TransferSyntaxUID: transferSyntaxUid,
        ImplementationClassUID: "1.2.826.0.1.3680043.10.854",
        ImplementationVersionName: "BRIGID_STGCMT_TEST",
    };

    const dicomDict = new DicomDict(
        DicomMetaDictionary.denaturalizeDataset(fileMeta),
    );
    dicomDict.dict = DicomMetaDictionary.denaturalizeDataset(dataset);

    const outputPath = path.join(
        TEMP_ROOT,
        `${sopInstanceUid.replace(/[^a-zA-Z0-9.-]+/g, "_")}.dcm`,
    );
    fs.writeFileSync(outputPath, Buffer.from(dicomDict.write({})));
    return outputPath;
}

export function clearStgcmtFixtureTempDir(): void {
    if (!fs.existsSync(TEMP_ROOT)) {
        return;
    }

    for (const entry of fs.readdirSync(TEMP_ROOT)) {
        fs.unlinkSync(path.join(TEMP_ROOT, entry));
    }
}
