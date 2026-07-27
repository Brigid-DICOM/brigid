import { expect } from "vitest";
import { getMovescuOutput, type MovescuResult } from "./movescuRunner";

export interface MovescuMoveResponse {
    statusText: string;
    responseIndex?: number;
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

export function parseMovescuResponses(log: string): MovescuMoveResponse[] {
    const responses: MovescuMoveResponse[] = [];
    let current: MovescuMoveResponse | null = null;

    for (const line of log.split(/\r?\n/)) {
        const finalMatch = line.match(MOVE_RESPONSE_FINAL_PATTERN);
        if (finalMatch) {
            if (current) {
                responses.push(current);
            }

            current = {
                statusText: finalMatch[1].trim(),
                isFinal: true,
            };
            continue;
        }

        const indexedMatch = line.match(MOVE_RESPONSE_INDEXED_PATTERN);
        if (indexedMatch) {
            if (current) {
                responses.push(current);
            }

            const responseIndex = Number.parseInt(indexedMatch[1], 10);
            current = {
                statusText: indexedMatch[2].trim(),
                responseIndex,
                completed: responseIndex,
                isFinal: false,
            };
            continue;
        }

        const responseMatch = line.match(MOVE_RESPONSE_PATTERN);
        if (responseMatch) {
            if (current) {
                responses.push(current);
            }

            current = {
                statusText: responseMatch[1].trim(),
                isFinal: false,
            };
            continue;
        }

        if (!current) {
            continue;
        }

        const remainingMatch = line.match(REMAINING_PATTERN);
        if (remainingMatch) {
            current.remaining = Number.parseInt(remainingMatch[1], 10);
            continue;
        }

        const completedMatch = line.match(COMPLETED_PATTERN);
        if (completedMatch) {
            current.completed = Number.parseInt(completedMatch[1], 10);
            continue;
        }

        const failedMatch = line.match(FAILED_PATTERN);
        if (failedMatch) {
            current.failures = Number.parseInt(failedMatch[1], 10);
            continue;
        }

        const warningMatch = line.match(WARNING_PATTERN);
        if (warningMatch) {
            current.warnings = Number.parseInt(warningMatch[1], 10);
        }
    }

    if (current) {
        responses.push(current);
    }

    return responses;
}

function getCompletedCount(response: MovescuMoveResponse): number | undefined {
    return response.completed ?? response.responseIndex;
}

export interface ExpectedMoveCounts {
    expectedCompleted: number;
    expectedFinalStatus?: "Success";
}

export function assertMovescuMoveCounts(
    result: MovescuResult,
    expected: ExpectedMoveCounts,
): void {
    const log = getMovescuOutput(result);
    const responses = parseMovescuResponses(log);
    const expectedFinalStatus = expected.expectedFinalStatus ?? "Success";

    expect(responses.length).toBeGreaterThan(0);

    const finalResponse = responses[responses.length - 1];
    const pendingResponses = responses.slice(0, -1);

    expect(finalResponse.isFinal).toBe(true);
    expect(finalResponse.statusText).toBe(expectedFinalStatus);

    const finalCompleted =
        getCompletedCount(finalResponse) ?? pendingResponses.length + 1;
    expect(finalCompleted).toBe(expected.expectedCompleted);
    expect(finalResponse.remaining ?? 0).toBe(0);
    expect(finalResponse.failures ?? 0).toBe(0);

    if (expected.expectedCompleted > 1) {
        expect(pendingResponses).toHaveLength(expected.expectedCompleted - 1);

        for (const [index, pending] of pendingResponses.entries()) {
            expect(pending.isFinal).toBe(false);
            expect(pending.statusText).toBe("Pending");
            expect(getCompletedCount(pending)).toBe(index + 1);
        }
    } else {
        expect(responses).toHaveLength(1);
        expect(responses[0].isFinal).toBe(true);
    }
}
