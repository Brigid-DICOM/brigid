import { expect } from "vitest";
import { getMovescuOutput, type MovescuResult } from "./movescuRunner";
import {
    type MovescuMoveResponse,
    parseMovescuResponses,
} from "./parseMovescuResponses";

export interface ExpectedMoveCounts {
    expectedCompleted: number;
    expectedFinalStatus?: "Success";
}

function resolveFinalCompleted(
    finalResponse: MovescuMoveResponse,
    pendingResponses: MovescuMoveResponse[],
): number {
    if (finalResponse.completed !== undefined) {
        return finalResponse.completed;
    }

    if (pendingResponses.length === 0) {
        return 1;
    }

    const lastPending = pendingResponses[pendingResponses.length - 1];
    const lastPendingCompleted = lastPending.completed;
    expect(lastPendingCompleted).toBeDefined();
    return (lastPendingCompleted ?? 0) + 1;
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
    expect(resolveFinalCompleted(finalResponse, pendingResponses)).toBe(
        expected.expectedCompleted,
    );
    expect(finalResponse.remaining ?? 0).toBe(0);
    expect(finalResponse.failures ?? 0).toBe(0);

    if (expected.expectedCompleted > 1) {
        expect(pendingResponses).toHaveLength(expected.expectedCompleted - 1);

        for (const [index, pending] of pendingResponses.entries()) {
            expect(pending.isFinal).toBe(false);
            expect(pending.statusText).toBe("Pending");
            expect(pending.completed).toBe(index + 1);
        }
    } else {
        expect(responses).toHaveLength(1);
        expect(responses[0].isFinal).toBe(true);
    }
}
