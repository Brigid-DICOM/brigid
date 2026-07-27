export interface FindscuImageResponse {
    patientId?: string;
    studyInstanceUid?: string;
    seriesInstanceUid?: string;
    sopClassUid?: string;
    sopInstanceUid?: string;
    instanceNumber?: string;
    contentDate?: string;
    contentTime?: string;
}

const SOP_CLASS_UID_BY_DCMTK_NAME: Record<string, string> = {
    CTImageStorage: "1.2.840.10008.5.1.4.1.1.2",
    SecondaryCaptureImageStorage: "1.2.840.10008.5.1.4.1.1.7",
    VLWholeSlideMicroscopyImageStorage: "1.2.840.10008.5.1.4.1.1.77.1.6",
    DigitalXRayImageStorageForPresentation: "1.2.840.10008.5.1.4.1.1.1.1",
    MRImageStorage: "1.2.840.10008.5.1.4.1.1.4",
};

const TAG_LINE_PATTERN =
    /^\s*I:\s*\((0008,0016|0008,0018|0020,0013|0008,0023|0008,0033|0010,0020|0020,000[dD]|0020,000[eE])\)\s+\S+\s+(?:\[(?<bracketValue>[^\]]*)\]|=(?<nameValue>\S+)|\(no value available\))/i;

function parseTagValue(
    tag: string,
    bracketValue: string | undefined,
    nameValue: string | undefined,
): string | undefined {
    const rawValue = (bracketValue ?? nameValue ?? "")
        .replace(/\0/g, "")
        .trim();
    if (rawValue.length === 0) {
        return undefined;
    }

    if (tag === "0008,0016" && !rawValue.startsWith("1.")) {
        return SOP_CLASS_UID_BY_DCMTK_NAME[rawValue] ?? rawValue;
    }

    return rawValue;
}

export function parseFindscuImageResponses(
    log: string,
): FindscuImageResponse[] {
    const responses: FindscuImageResponse[] = [];
    let current: FindscuImageResponse | null = null;

    for (const line of log.split(/\r?\n/)) {
        const pendingMatch = line.match(/Find Response:\s+\d+\s+\(Pending\)/);
        if (pendingMatch) {
            if (current) {
                responses.push(current);
            }
            current = {};
            continue;
        }

        if (!current) {
            continue;
        }

        const tagMatch = line.match(TAG_LINE_PATTERN);
        if (!tagMatch?.groups) {
            continue;
        }

        const tag = tagMatch[1].toUpperCase();
        const parsedValue = parseTagValue(
            tag,
            tagMatch.groups.bracketValue,
            tagMatch.groups.nameValue,
        );

        switch (tag) {
            case "0010,0020":
                current.patientId = parsedValue;
                break;
            case "0020,000D":
                current.studyInstanceUid = parsedValue;
                break;
            case "0020,000E":
                current.seriesInstanceUid = parsedValue;
                break;
            case "0008,0016":
                current.sopClassUid = parsedValue;
                break;
            case "0008,0018":
                current.sopInstanceUid = parsedValue;
                break;
            case "0020,0013":
                current.instanceNumber = parsedValue;
                break;
            case "0008,0023":
                current.contentDate = parsedValue;
                break;
            case "0008,0033":
                current.contentTime = parsedValue;
                break;
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}
