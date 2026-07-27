import { describe, expect, it } from "vitest";
import {
    assertReceivedSopInstanceUids,
    prepareMoveCase,
    useCmoveTestSetup,
} from "./helpers/cmoveTestSetup";
import {
    getMoveDestinationAeTitle,
    runMovescuPatient,
} from "./helpers/movescuRunner";
import { assertMovescuMoveCounts } from "./helpers/assertMovescuMoveCounts";
import { getC3N00953SopInstanceUids } from "./helpers/seedC3N00953";

// biome-ignore lint/correctness/useHookAtTopLevel: this is a backend test
useCmoveTestSetup();

describe("DIMSE C-MOVE (Patient level)", () => {
    it("PatientID exact: C3N-00953 retrieves all 11 instances", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuPatient(
            "PatientID",
            "C3N-00953",
            moveDestination,
        );

        expect(result.exitCode).toBe(0);
        assertMovescuMoveCounts(result, { expectedCompleted: 11 });
        await assertReceivedSopInstanceUids(
            storescp,
            getC3N00953SopInstanceUids(),
        );
    });
});
