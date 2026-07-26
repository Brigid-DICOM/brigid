export interface FindscuPatientResponse {
    patientId?: string;
    patientName?: string;
    patientBirthDate?: string;
}

const TAG_LINE_PATTERN =
    /^\s*I:\s*\((0010,0010|0010,0020|0010,0030)\)\s+\S+\s+\[([^\]]*)\]/;

export function parseFindscuResponses(log: string): FindscuPatientResponse[] {
    const responses: FindscuPatientResponse[] = [];
    let current: FindscuPatientResponse | null = null;

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
        const value = rawValue.trim();
        if (tag === "0010,0010") {
            current.patientName = value.length > 0 ? value : undefined;
        } else if (tag === "0010,0020") {
            current.patientId = value.length > 0 ? value : undefined;
        } else if (tag === "0010,0030") {
            current.patientBirthDate = value.length > 0 ? value : undefined;
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}
