export interface MovescuMoveResponse {
    statusText: string;
    remaining?: number;
    completed?: number;
    warnings?: number;
    failures?: number;
    isFinal: boolean;
}

const MOVE_RESPONSE_FINAL_PATTERN =
    /^[IW]:\s*Received Final Move Response \(([^)]+)\)/i;

const MOVE_RESPONSE_INDEXED_PATTERN =
    /^[IW]:\s*Received Move Response (\d+) \(([^)]+)\)/i;

const MOVE_RESPONSE_PATTERN = /^[IW]:\s*Received Move Response \(([^)]+)\)/i;

const REMAINING_PATTERN =
    /^[IW]:\s*Number of Remaining Sub-Operations\s*:\s*(\d+)/i;

const COMPLETED_PATTERN =
    /^[IW]:\s*Number of Completed Sub-Operations\s*:\s*(\d+)/i;

const FAILED_PATTERN = /^[IW]:\s*Number of Failed Sub-Operations\s*:\s*(\d+)/i;

const WARNING_PATTERN =
    /^[IW]:\s*Number of Warning Sub-Operations\s*:\s*(\d+)/i;

function beginResponse(
    responses: MovescuMoveResponse[],
    current: MovescuMoveResponse | null,
    next: MovescuMoveResponse,
): MovescuMoveResponse {
    if (current) {
        responses.push(current);
    }

    return next;
}

function applyCountLine(current: MovescuMoveResponse, line: string): boolean {
    const remainingMatch = line.match(REMAINING_PATTERN);
    if (remainingMatch) {
        current.remaining = Number.parseInt(remainingMatch[1], 10);
        return true;
    }

    const completedMatch = line.match(COMPLETED_PATTERN);
    if (completedMatch) {
        current.completed = Number.parseInt(completedMatch[1], 10);
        return true;
    }

    const failedMatch = line.match(FAILED_PATTERN);
    if (failedMatch) {
        current.failures = Number.parseInt(failedMatch[1], 10);
        return true;
    }

    const warningMatch = line.match(WARNING_PATTERN);
    if (warningMatch) {
        current.warnings = Number.parseInt(warningMatch[1], 10);
        return true;
    }

    return false;
}

export function parseMovescuResponses(log: string): MovescuMoveResponse[] {
    const responses: MovescuMoveResponse[] = [];
    let current: MovescuMoveResponse | null = null;

    for (const line of log.split(/\r?\n/)) {
        const finalMatch = line.match(MOVE_RESPONSE_FINAL_PATTERN);
        if (finalMatch) {
            current = beginResponse(responses, current, {
                statusText: finalMatch[1].trim(),
                isFinal: true,
            });
            continue;
        }

        const indexedMatch = line.match(MOVE_RESPONSE_INDEXED_PATTERN);
        if (indexedMatch) {
            const completed = Number.parseInt(indexedMatch[1], 10);
            current = beginResponse(responses, current, {
                statusText: indexedMatch[2].trim(),
                completed,
                isFinal: false,
            });
            continue;
        }

        const responseMatch = line.match(MOVE_RESPONSE_PATTERN);
        if (responseMatch) {
            current = beginResponse(responses, current, {
                statusText: responseMatch[1].trim(),
                isFinal: false,
            });
            continue;
        }

        if (current) {
            applyCountLine(current, line);
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}
