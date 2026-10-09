import fsE from "fs-extra";
import { afterAll, beforeAll } from "vitest";
import { assertDcm4cheToolInstalled } from "./dcm4cheToolRunner";
import {
    clearAndSeedDicomDataForCmoveSuite,
    releaseDicomDataPreservation,
} from "./dimseTestContext";
import { seedCommitmentReportDestinationAllowedRemote } from "./seedC3N00953";
import { getEphemeralPort, getStgcmtOutputDir } from "./stgcmtscuRunner";
import { clearStgcmtFixtureTempDir } from "./storageCommitmentFixtures";

let bindPort: number | undefined;

export function useStorageCommitmentTestSetup(): void {
    beforeAll(async () => {
        assertDcm4cheToolInstalled();
        bindPort = await getEphemeralPort();
        await clearAndSeedDicomDataForCmoveSuite();
        await seedCommitmentReportDestinationAllowedRemote(bindPort);
        await fsE.ensureDir(getStgcmtOutputDir());
    });

    afterAll(() => {
        bindPort = undefined;
        clearStgcmtFixtureTempDir();
        releaseDicomDataPreservation();
    });
}

export function getStgcmtBindPort(): number {
    if (bindPort === undefined) {
        throw new Error(
            "stgcmtscu bind port is not initialized; call useStorageCommitmentTestSetup() first",
        );
    }

    return bindPort;
}

export async function prepareStorageCommitmentCase(): Promise<string> {
    const outputDir = getStgcmtOutputDir();
    await fsE.ensureDir(outputDir);
    await fsE.emptyDir(outputDir);
    return outputDir;
}
