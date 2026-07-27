import { describe, expect, it } from "vitest";
import {
    assertStgcmtUidSets,
    parseStgcmtResults,
} from "./helpers/parseStgcmtResults";
import {
    C3N_00953_ABD_ROUTINE_SOP_INSTANCE_UID,
    C3N_00953_TOPOGRAM_SOP_INSTANCE_UID,
    getC3N00953AbdRoutineFixturePath,
    getC3N00953TopogramFixturePath,
    NONEXISTENT_SOP_INSTANCE_UID,
} from "./helpers/seedC3N00953";
import {
    getStgcmtBindPort,
    prepareStorageCommitmentCase,
    useStorageCommitmentTestSetup,
} from "./helpers/storageCommitmentTestSetup";
import { createFixtureWithSopInstanceUid } from "./helpers/storageCommitmentFixtures";
import { runStgcmtscu } from "./helpers/stgcmtscuRunner";

// biome-ignore lint/correctness/useHookAtTopLevel: this is a backend test
useStorageCommitmentTestSetup();

describe("DIMSE Storage Commitment (Push Model)", () => {
    it("All instances exist: reports both instances as Success", async () => {
        const outputDir = await prepareStorageCommitmentCase();

        const result = await runStgcmtscu({
            bindPort: getStgcmtBindPort(),
            outputDir,
            files: [
                { filePath: getC3N00953TopogramFixturePath() },
                { filePath: getC3N00953AbdRoutineFixturePath() },
            ],
        });

        expect(result.exitCode).toBe(0);

        const parsed = await parseStgcmtResults(outputDir);
        assertStgcmtUidSets(parsed, {
            successUids: [
                C3N_00953_TOPOGRAM_SOP_INSTANCE_UID,
                C3N_00953_ABD_ROUTINE_SOP_INSTANCE_UID,
            ],
            failedUids: [],
        });
    });

    it("Mixed exist / not exist: splits Success and Failed UIDs", async () => {
        const outputDir = await prepareStorageCommitmentCase();
        const missingFixture = createFixtureWithSopInstanceUid(
            getC3N00953AbdRoutineFixturePath(),
            NONEXISTENT_SOP_INSTANCE_UID,
        );

        const result = await runStgcmtscu({
            bindPort: getStgcmtBindPort(),
            outputDir,
            files: [
                { filePath: getC3N00953TopogramFixturePath() },
                { filePath: missingFixture },
            ],
        });

        expect(result.exitCode).toBe(0);

        const parsed = await parseStgcmtResults(outputDir);
        assertStgcmtUidSets(parsed, {
            successUids: [C3N_00953_TOPOGRAM_SOP_INSTANCE_UID],
            failedUids: [NONEXISTENT_SOP_INSTANCE_UID],
        });
    });

    it("All instances not exist: reports both instances as Failed", async () => {
        const outputDir = await prepareStorageCommitmentCase();
        const missingUidA = "1.2.3.4.5.6.7.8.9.0.98";
        const missingUidB = NONEXISTENT_SOP_INSTANCE_UID;
        const missingFixtureA = createFixtureWithSopInstanceUid(
            getC3N00953TopogramFixturePath(),
            missingUidA,
        );
        const missingFixtureB = createFixtureWithSopInstanceUid(
            getC3N00953AbdRoutineFixturePath(),
            missingUidB,
        );

        const result = await runStgcmtscu({
            bindPort: getStgcmtBindPort(),
            outputDir,
            files: [
                { filePath: missingFixtureA },
                { filePath: missingFixtureB },
            ],
        });

        expect(result.exitCode).toBe(0);

        const parsed = await parseStgcmtResults(outputDir);
        assertStgcmtUidSets(parsed, {
            successUids: [],
            failedUids: [missingUidA, missingUidB],
        });
    });
});
