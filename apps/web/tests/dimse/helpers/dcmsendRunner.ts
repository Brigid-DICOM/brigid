import { execSync, spawn, spawnSync } from "node:child_process";

const DCMTK_INSTALL_HINT =
    "Install DCMTK 3.7.x and ensure dcmsend is in PATH. See https://dcmtk.org/";

export function assertDcmtkInstalled(): void {
    let output = "";
    try {
        output = execSync("dcmsend --version", {
            encoding: "utf-8",
            stdio: ["pipe", "pipe", "pipe"],
        });
    } catch (error) {
        const execError = error as {
            stdout?: string;
            stderr?: string;
            message?: string;
        };
        output = [execError.stdout, execError.stderr, execError.message]
            .filter(Boolean)
            .join("\n");
    }

    if (!/dcmsend/i.test(output)) {
        throw new Error(`dcmsend not found in PATH.\n${DCMTK_INSTALL_HINT}`);
    }

    if (!/3\.7\./.test(output)) {
        throw new Error(
            `DCMTK 3.7.x required for dimse e2e tests.\n${output}\n${DCMTK_INSTALL_HINT}`,
        );
    }
}

export interface DcmsendResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

function getDimseConnectionArgs(): {
    host: string;
    port: string;
    calledAe: string;
    callingAe: string;
} {
    return {
        host: process.env.TEST_DIMSE_HOST ?? "127.0.0.1",
        port: process.env.TEST_DIMSE_PORT ?? "11113",
        calledAe: process.env.TEST_DIMSE_AE_TITLE ?? "BRIGID_TEST",
        callingAe: process.env.TEST_DIMSE_CALLING_AE ?? "DCMSEND_SCU",
    };
}

function runProcess(
    command: string,
    args: string[],
): Promise<DcmsendResult> {
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

export function runEchoscu(): DcmsendResult {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();

    const result = spawnSync(
        "echoscu",
        [host, port, "-aec", calledAe, "-aet", callingAe],
        { encoding: "utf-8" },
    );

    return {
        exitCode: result.status ?? 1,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}

export async function runDcmsend(fixturePath: string): Promise<DcmsendResult> {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();
    const args = [
        host,
        port,
        fixturePath,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
        "-v",
    ];
    console.log("running dcmsend with args", args);
    return runProcess("dcmsend", args);
}
