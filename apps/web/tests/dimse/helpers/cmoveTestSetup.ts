import { afterAll, beforeAll, expect } from "vitest";
import {
    clearAndSeedDicomDataForCmoveSuite,
    releaseDicomDataPreservation,
} from "./dimseTestContext";
import { seedMoveDestinationAllowedRemote } from "./seedC3N00953";
import {
    clearStorescpOutput,
    readReceivedSopInstanceUids,
    type StorescpInstance,
    startStorescp,
    stopStorescp,
} from "./storescpRunner";

let storescpInstance: StorescpInstance | undefined;

export function useCmoveTestSetup(): void {
    beforeAll(async () => {
        await clearAndSeedDicomDataForCmoveSuite();
        storescpInstance = await startStorescp();
        await seedMoveDestinationAllowedRemote(storescpInstance.port);
    });

    afterAll(async () => {
        if (storescpInstance) {
            await stopStorescp(storescpInstance);
            storescpInstance = undefined;
        }
        releaseDicomDataPreservation();
    });
}

export function getStorescpInstance(): StorescpInstance {
    if (!storescpInstance) {
        throw new Error(
            "storescp is not started; call useCmoveTestSetup() first",
        );
    }

    return storescpInstance;
}

export async function prepareMoveCase(): Promise<StorescpInstance> {
    const instance = getStorescpInstance();
    await clearStorescpOutput(instance);
    return instance;
}

export async function assertReceivedSopInstanceUids(
    instance: StorescpInstance,
    expectedUids: string[],
): Promise<void> {
    const receivedUids = await readReceivedSopInstanceUids(instance);
    expect(receivedUids).toEqual(
        [...expectedUids].sort((left, right) => left.localeCompare(right)),
    );
}
