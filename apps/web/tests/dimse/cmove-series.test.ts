import { describe, expect, it } from "vitest";
import { assertMovescuMoveCounts } from "./helpers/assertMovescuMoveCounts";
import {
    assertReceivedSopInstanceUids,
    prepareMoveCase,
    useCmoveTestSetup,
} from "./helpers/cmoveTestSetup";
import {
    getMoveDestinationAeTitle,
    runMovescuSeries,
} from "./helpers/movescuRunner";
import {
    C3N_00953_SERIES_ABD_ROUTINE_UID,
    C3N_00953_SERIES_TOPOGRAM_UID,
    C3N_00953_STUDY_UID,
    getC3N00953SeriesSopInstanceUids,
} from "./helpers/seedC3N00953";

useCmoveTestSetup();

describe("DIMSE C-MOVE (Series level)", () => {
    it("Series: ABD ROUTINE retrieves 5 instances", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuSeries(
            C3N_00953_STUDY_UID,
            "SeriesInstanceUID",
            C3N_00953_SERIES_ABD_ROUTINE_UID,
            moveDestination,
        );

        expect(result.exitCode).toBe(0);
        assertMovescuMoveCounts(result, { expectedCompleted: 5 });
        await assertReceivedSopInstanceUids(
            storescp,
            getC3N00953SeriesSopInstanceUids(C3N_00953_SERIES_ABD_ROUTINE_UID),
        );
    });

    it("Series: Topogram retrieves 1 instance", async () => {
        const storescp = await prepareMoveCase();
        const moveDestination = getMoveDestinationAeTitle();

        const result = await runMovescuSeries(
            C3N_00953_STUDY_UID,
            "SeriesInstanceUID",
            C3N_00953_SERIES_TOPOGRAM_UID,
            moveDestination,
        );

        expect(result.exitCode).toBe(0);
        assertMovescuMoveCounts(result, { expectedCompleted: 1 });
        await assertReceivedSopInstanceUids(
            storescp,
            getC3N00953SeriesSopInstanceUids(C3N_00953_SERIES_TOPOGRAM_UID),
        );
    });
});
