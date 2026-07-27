import { describe, expect, it } from "vitest";
import {
    assertReceivedSopInstanceUids,
    prepareMoveCase,
    useCmoveTestSetup,
} from "./helpers/cmoveTestSetup";
import {
    expectMovescuStatus,
    getMoveDestinationAeTitle,
    getMovescuOutput,
    runMovescuStudy,
} from "./helpers/movescuRunner";
import { assertMovescuMoveCounts } from "./helpers/parseMovescuResponses";
import {
    C3N_00953_STUDY_UID,
    getC3N00953SopInstanceUids,
} from "./helpers/seedC3N00953";
import { readReceivedInstanceCount } from "./helpers/storescpRunner";

// biome-ignore lint/correctness/useHookAtTopLevel: this is a backend test
useCmoveTestSetup();

describe("DIMSE C-MOVE (Study level)", () => {
    it("StudyInstanceUID exact: C3N-00953 retrieves all 11 instances", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuStudy(
            "StudyInstanceUID",
            C3N_00953_STUDY_UID,
            moveDestination,
        );

        expect(result.exitCode).toBe(0);
        assertMovescuMoveCounts(result, { expectedCompleted: 11 });
        await assertReceivedSopInstanceUids(
            storescp,
            getC3N00953SopInstanceUids(),
        );
    });

    it("Negative: unknown destination returns MoveDestinationUnknown", async () => {
        const storescp = await prepareMoveCase();

        const result = await runMovescuStudy(
            "StudyInstanceUID",
            C3N_00953_STUDY_UID,
            "UNKNOWN_AE",
        );

        const output = getMovescuOutput(result);
        const hasFailure = result.exitCode !== 0 || /0xA801/i.test(output);
        expect(hasFailure).toBe(true);
        expectMovescuStatus(result, "0xA801");
        expect(await readReceivedInstanceCount(storescp)).toBe(0);
    });

    it("Negative: no such study returns NoSuchObjectInstance", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuStudy(
            "StudyInstanceUID",
            "1.2.3.4.5",
            moveDestination,
        );

        expectMovescuStatus(result, "0x0112");
        expect(await readReceivedInstanceCount(storescp)).toBe(0);
    });
});
