export interface FindscuStudyResponse {
    patientId?: string;
    patientName?: string;
    studyInstanceUid?: string;
    studyDate?: string;
    studyTime?: string;
    accessionNumber?: string;
    modalitiesInStudy?: string;
    studyId?: string;
    referringPhysicianName?: string;
}

const TAG_LINE_PATTERN =
    /^\s*I:\s*\((0010,0010|0010,0020|0020,000[dD]|0008,0020|0008,0030|0008,0050|0008,0061|0020,0010|0008,0090)\)\s+\S+\s+\[([^\]]*)\]/i;

export function parseFindscuStudyResponses(
    log: string,
): FindscuStudyResponse[] {
    const responses: FindscuStudyResponse[] = [];
    let current: FindscuStudyResponse | null = null;

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
        if (!tagMatch) {
            continue;
        }

        const [, tag, rawValue] = tagMatch;
        const value = rawValue.replace(/\0/g, "").trim();
        const parsedValue = value.length > 0 ? value : undefined;
        const normalizedTag = tag.toUpperCase();

        switch (normalizedTag) {
            case "0010,0010":
                current.patientName = parsedValue;
                break;
            case "0010,0020":
                current.patientId = parsedValue;
                break;
            case "0020,000D":
                current.studyInstanceUid = parsedValue;
                break;
            case "0008,0020":
                current.studyDate = parsedValue;
                break;
            case "0008,0030":
                current.studyTime = parsedValue;
                break;
            case "0008,0050":
                current.accessionNumber = parsedValue;
                break;
            case "0008,0061":
                current.modalitiesInStudy = parsedValue;
                break;
            case "0020,0010":
                current.studyId = parsedValue;
                break;
            case "0008,0090":
                current.referringPhysicianName = parsedValue;
                break;
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}
