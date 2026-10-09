export interface FindscuSeriesResponse {
    patientId?: string;
    studyInstanceUid?: string;
    seriesInstanceUid?: string;
    modality?: string;
    seriesNumber?: string;
    seriesDate?: string;
    seriesDescription?: string;
}

const TAG_LINE_PATTERN =
    /^\s*I:\s*\((0010,0020|0020,000[dD]|0020,000[eE]|0008,0060|0020,0011|0008,0021|0008,103[eE])\)\s+\S+\s+\[([^\]]*)\]/i;

export function parseFindscuSeriesResponses(
    log: string,
): FindscuSeriesResponse[] {
    const responses: FindscuSeriesResponse[] = [];
    let current: FindscuSeriesResponse | null = null;

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
            case "0010,0020":
                current.patientId = parsedValue;
                break;
            case "0020,000D":
                current.studyInstanceUid = parsedValue;
                break;
            case "0020,000E":
                current.seriesInstanceUid = parsedValue;
                break;
            case "0008,0060":
                current.modality = parsedValue;
                break;
            case "0020,0011":
                current.seriesNumber = parsedValue;
                break;
            case "0008,0021":
                current.seriesDate = parsedValue;
                break;
            case "0008,103E":
                current.seriesDescription = parsedValue;
                break;
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}
