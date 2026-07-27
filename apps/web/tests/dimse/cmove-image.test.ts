import { describe, expect, it } from "vitest";
import {
    assertReceivedSopInstanceUids,
    prepareMoveCase,
    useCmoveTestSetup,
} from "./helpers/cmoveTestSetup";
import {
    getMoveDestinationAeTitle,
    runMovescuImage,
} from "./helpers/movescuRunner";
import { assertMovescuMoveCounts } from "./helpers/assertMovescuMoveCounts";
import {
    C3N_00953_SERIES_TOPOGRAM_UID,
    C3N_00953_STUDY_UID,
    C3N_00953_TOPOGRAM_SOP_INSTANCE_UID,
} from "./helpers/seedC3N00953";

// biome-ignore lint/correctness/useHookAtTopLevel: this is a backend test
useCmoveTestSetup();

describe("DIMSE C-MOVE (Image level)", () => {
    it("Image: 1000.dcm (Topogram) retrieves 1 instance", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuImage(
            C3N_00953_STUDY_UID,
            C3N_00953_SERIES_TOPOGRAM_UID,
            "SOPInstanceUID",
            C3N_00953_TOPOGRAM_SOP_INSTANCE_UID,
            moveDestination,
        );

        expect(result.exitCode).toBe(0);
        assertMovescuMoveCounts(result, { expectedCompleted: 1 });
        await assertReceivedSopInstanceUids(storescp, [
            C3N_00953_TOPOGRAM_SOP_INSTANCE_UID,
        ]);
    });
});
