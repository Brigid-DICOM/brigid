import { type ChildProcess, spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { join } from "desm";
import fsE from "fs-extra";
import { getMoveDestinationAeTitle } from "./movescuRunner";
import { readDicomTags } from "./readDicomTags";

const OUTPUT_DIR = path.resolve(
    join(import.meta.url, "../.tmp/storescp-output"),
);

const SOP_INSTANCE_UID_TAG = "0008,0018" as const;

export interface StorescpInstance {
    process: ChildProcess;
    port: number;
    aeTitle: string;
    outputDir: string;
}

async function getEphemeralPort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = createServer();
        server.listen(0, "127.0.0.1", () => {
            const address = server.address();
            const port =
                typeof address === "object" && address !== null
                    ? address.port
                    : 0;
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(port);
            });
        });
        server.on("error", reject);
    });
}

export async function startStorescp(): Promise<StorescpInstance> {
    const port = await getEphemeralPort();
    const aeTitle = getMoveDestinationAeTitle();

    await fsE.ensureDir(OUTPUT_DIR);
    await fsE.emptyDir(OUTPUT_DIR);

    const child = spawn(
        "storescp",
        ["-aet", aeTitle, "-od", OUTPUT_DIR, "-fe", ".dcm", String(port)],
        {
            stdio: ["ignore", "pipe", "pipe"],
        },
    );

    await waitForStorescpReady(child, port);

    return {
        process: child,
        port,
        aeTitle,
        outputDir: OUTPUT_DIR,
    };
}

async function waitForStorescpReady(
    child: ChildProcess,
    port: number,
    timeoutMs = 10_000,
): Promise<void> {
    const startedAt = Date.now();

    while (Date.now() - startedAt < timeoutMs) {
        if (child.exitCode !== null) {
            throw new Error(
                `storescp exited before ready (code ${child.exitCode})`,
            );
        }

        const isListening = await isPortListening(port);
        if (isListening) {
            return;
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    throw new Error(`storescp did not become ready on port ${port}`);
}

function isPortListening(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = createServer();
        socket.once("error", () => resolve(true));
        socket.listen(port, "127.0.0.1", () => {
            socket.close(() => resolve(false));
        });
    });
}

export async function stopStorescp(instance: StorescpInstance): Promise<void> {
    if (instance.process.exitCode !== null) {
        return;
    }

    instance.process.kill();

    await Promise.race([
        new Promise<void>((resolve) => {
            instance.process.once("close", () => resolve());
        }),
        new Promise<void>((resolve) => {
            setTimeout(() => {
                if (instance.process.exitCode === null) {
                    instance.process.kill("SIGKILL");
                }
                resolve();
            }, 2_000);
        }),
    ]);
}

export async function clearStorescpOutput(
    instance: StorescpInstance,
): Promise<void> {
    await fsE.emptyDir(instance.outputDir);
}

async function listDicomFiles(outputDir: string): Promise<string[]> {
    const entries = await fsE.readdir(outputDir);
    return entries
        .filter((entry) => entry.toLowerCase().endsWith(".dcm"))
        .map((entry) => path.join(outputDir, entry))
        .sort((left, right) => left.localeCompare(right));
}

export async function readReceivedSopInstanceUids(
    instance: StorescpInstance,
): Promise<string[]> {
    const files = await listDicomFiles(instance.outputDir);
    const uids: string[] = [];

    for (const file of files) {
        const tags = readDicomTags(file, [SOP_INSTANCE_UID_TAG]);
        const uid = tags[SOP_INSTANCE_UID_TAG];
        if (uid) {
            uids.push(uid);
        }
    }

    return uids.sort((left, right) => left.localeCompare(right));
}

export async function readReceivedInstanceCount(
    instance: StorescpInstance,
): Promise<number> {
    const files = await listDicomFiles(instance.outputDir);
    return files.length;
}
