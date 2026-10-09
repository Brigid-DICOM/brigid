import { spawn } from "node:child_process";
import { createServer } from "node:net";
import path from "node:path";
import { join } from "desm";
import {
    getDcm4cheToolRoot,
    getStgcmtscuExecutable,
} from "./dcm4cheToolRunner";
import { type DimseScuResult, getDimseConnectionArgs } from "./dimseScuRunner";

export type StgcmtscuResult = DimseScuResult;

export interface StgcmtscuAttributeOverride {
    attribute: string;
    value: string;
}

export interface StgcmtscuFileInput {
    filePath: string;
    overrides?: StgcmtscuAttributeOverride[];
}

export interface RunStgcmtscuOptions {
    bindPort: number;
    outputDir: string;
    files: StgcmtscuFileInput[];
}

export function getStgcmtCallingAeTitle(): string {
    return process.env.TEST_STGCMT_CALLING_AE ?? "STGCMTSCU_TEST";
}

export function getStgcmtOutputDir(): string {
    return path.resolve(join(import.meta.url, "../.tmp/stgcmt-output"));
}

export async function getEphemeralPort(): Promise<number> {
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

function buildStgcmtscuArgs(options: RunStgcmtscuOptions): string[] {
    const { host, port, calledAe } = getDimseConnectionArgs();
    const callingAe = getStgcmtCallingAeTitle();
    const bindHost = process.env.TEST_DIMSE_HOST ?? "127.0.0.1";

    const args = [
        "-b",
        `${callingAe}@${bindHost}:${options.bindPort}`,
        "-c",
        `${calledAe}@${host}:${port}`,
        "--directory",
        options.outputDir,
    ];

    for (const file of options.files) {
        for (const override of file.overrides ?? []) {
            args.push("-s", `${override.attribute}=${override.value}`);
        }
        args.push(file.filePath);
    }

    return args;
}

export async function runStgcmtscu(
    options: RunStgcmtscuOptions,
): Promise<StgcmtscuResult> {
    const executable = getStgcmtscuExecutable();
    const args = buildStgcmtscuArgs(options);
    process.env.DCM4CHE_HOME = getDcm4cheToolRoot();

    const spawnCommand = process.platform === "win32" ? "cmd.exe" : executable;
    const spawnArgs =
        process.platform === "win32"
            ? ["/d", "/s", "/c", executable, ...args]
            : args;

    return new Promise((resolve, reject) => {
        const child = spawn(spawnCommand, spawnArgs, {
            env: process.env,
            windowsHide: true,
        });
        let stdout = "";
        let stderr = "";

        child.stdout.setEncoding("utf-8");
        child.stderr.setEncoding("utf-8");
        child.stdout.on("data", (chunk: string) => {
            stdout += chunk;
        });
        child.stderr.on("data", (chunk: string) => {
            stderr += chunk;
        });
        child.on("error", reject);
        child.on("close", (code: number | null) => {
            resolve({
                exitCode: code ?? 1,
                stdout,
                stderr,
            });
        });
    });
}
