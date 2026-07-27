import fs from "node:fs";
import path from "node:path";
import * as dcmjs from "dcmjs";

const { DicomMessage, DicomMetaDictionary } = dcmjs.data;

interface SequenceItem {
    ReferencedSOPClassUID?: string;
    ReferencedSOPInstanceUID?: string;
}

export interface StgcmtParseResult {
    successUids: string[];
    failedUids: string[];
}

function readSequenceItems(value: unknown): SequenceItem[] {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (item): item is SequenceItem =>
            typeof item === "object" && item !== null,
    );
}

function collectUidsFromSequence(
    items: SequenceItem[],
    target: Set<string>,
): void {
    for (const item of items) {
        const uid = item.ReferencedSOPInstanceUID;
        if (typeof uid === "string" && uid.length > 0) {
            target.add(uid);
        }
    }
}

function parseResultFile(filePath: string): StgcmtParseResult {
    const buffer = fs.readFileSync(filePath);
    const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
    );
    const dicomDict = DicomMessage.readFile(arrayBuffer);
    const dataset = DicomMetaDictionary.naturalizeDataset(dicomDict.dict);

    const successUids = new Set<string>();
    const failedUids = new Set<string>();

    collectUidsFromSequence(
        readSequenceItems(dataset.ReferencedSOPSequence),
        successUids,
    );
    collectUidsFromSequence(
        readSequenceItems(dataset.FailedSOPSequence),
        failedUids,
    );

    return {
        successUids: [...successUids],
        failedUids: [...failedUids],
    };
}

async function listResultFiles(outputDir: string): Promise<string[]> {
    const entries = await fs.promises.readdir(outputDir);
    return entries
        .map((entry) => path.join(outputDir, entry))
        .sort((left, right) => left.localeCompare(right));
}

export async function parseStgcmtResults(
    outputDir: string,
): Promise<StgcmtParseResult> {
    const files = await listResultFiles(outputDir);
    const successUids = new Set<string>();
    const failedUids = new Set<string>();

    for (const file of files) {
        const parsed = parseResultFile(file);
        for (const uid of parsed.successUids) {
            successUids.add(uid);
        }
        for (const uid of parsed.failedUids) {
            failedUids.add(uid);
        }
    }

    return {
        successUids: [...successUids].sort((left, right) =>
            left.localeCompare(right),
        ),
        failedUids: [...failedUids].sort((left, right) =>
            left.localeCompare(right),
        ),
    };
}

export function assertStgcmtUidSets(
    actual: StgcmtParseResult,
    expected: {
        successUids: string[];
        failedUids: string[];
    },
): void {
    const sortUids = (uids: string[]) =>
        [...uids].sort((left, right) => left.localeCompare(right));

    const actualSuccess = sortUids(actual.successUids);
    const actualFailed = sortUids(actual.failedUids);
    const expectedSuccess = sortUids(expected.successUids);
    const expectedFailed = sortUids(expected.failedUids);

    if (
        actualSuccess.length !== expectedSuccess.length ||
        actualSuccess.some((uid, index) => uid !== expectedSuccess[index])
    ) {
        throw new Error(
            `Unexpected success UIDs.\nExpected: ${expectedSuccess.join(", ") || "(empty)"}\nActual: ${actualSuccess.join(", ") || "(empty)"}`,
        );
    }

    if (
        actualFailed.length !== expectedFailed.length ||
        actualFailed.some((uid, index) => uid !== expectedFailed[index])
    ) {
        throw new Error(
            `Unexpected failed UIDs.\nExpected: ${expectedFailed.join(", ") || "(empty)"}\nActual: ${actualFailed.join(", ") || "(empty)"}`,
        );
    }
}
