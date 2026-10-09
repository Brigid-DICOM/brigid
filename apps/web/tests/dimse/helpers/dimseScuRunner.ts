import { spawn, spawnSync } from "node:child_process";

export const DCMTK_INSTALL_HINT =
    "Install DCMTK 3.7.x and ensure dcmsend, findscu, movescu, and storescp are in PATH. See https://dcmtk.org/";

export interface DimseScuResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

export interface DimseConnectionArgs {
    host: string;
    port: string;
    calledAe: string;
    callingAe: string;
}

function getExecOutput(command: string, args: string[]): string {
    const result = spawnSync(command, args, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
    });

    return [result.stdout, result.stderr, result.error?.message]
        .filter(Boolean)
        .join("\n");
}

function assertCommandAvailable(
    command: string,
    pattern: RegExp,
    label: string,
): string {
    const output = getExecOutput(command, ["--version"]);

    if (!pattern.test(output)) {
        throw new Error(`${label} not found in PATH.\n${DCMTK_INSTALL_HINT}`);
    }

    return output;
}

export function assertDcmtkInstalled(): void {
    const dcmsendOutput = assertCommandAvailable(
        "dcmsend",
        /dcmsend/i,
        "dcmsend",
    );

    if (!/3\.7\./.test(dcmsendOutput)) {
        throw new Error(
            `DCMTK 3.7.x required for dimse e2e tests.\n${dcmsendOutput}\n${DCMTK_INSTALL_HINT}`,
        );
    }

    assertCommandAvailable("findscu", /findscu/i, "findscu");

    const movescuOutput = assertCommandAvailable(
        "movescu",
        /movescu/i,
        "movescu",
    );
    if (!/3\.7\./.test(movescuOutput)) {
        throw new Error(
            `DCMTK 3.7.x required for movescu dimse e2e tests.\n${movescuOutput}\n${DCMTK_INSTALL_HINT}`,
        );
    }

    assertCommandAvailable("storescp", /storescp/i, "storescp");
}

export function getDimseConnectionArgs(): DimseConnectionArgs {
    return {
        host: process.env.TEST_DIMSE_HOST ?? "127.0.0.1",
        port: process.env.TEST_DIMSE_PORT ?? "11113",
        calledAe: process.env.TEST_DIMSE_AE_TITLE ?? "BRIGID_TEST",
        callingAe: process.env.TEST_DIMSE_CALLING_AE ?? "DCMSEND_SCU",
    };
}

export function runProcessAsync(
    command: string,
    args: string[],
): Promise<DimseScuResult> {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args);
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

export function runProcessSync(
    command: string,
    args: string[],
): DimseScuResult {
    const result = spawnSync(command, args, { encoding: "utf-8" });

    return {
        exitCode: result.status ?? 1,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}
