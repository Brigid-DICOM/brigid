import { execSync, spawnSync } from "node:child_process";

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

export function runDcmsend(fixturePath: string): DcmsendResult {
    const host = process.env.TEST_DIMSE_HOST ?? "127.0.0.1";
    const port = process.env.TEST_DIMSE_PORT ?? "11113";
    const calledAe = process.env.TEST_DIMSE_AE_TITLE ?? "BRIGID_TEST";
    const callingAe = process.env.TEST_DIMSE_CALLING_AE ?? "DCMSEND_SCU";

    const result = spawnSync(
        "dcmsend",
        [host, port, fixturePath, "-aec", calledAe, "-aet", callingAe],
        { encoding: "utf-8" },
    );

    return {
        exitCode: result.status ?? 1,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
    };
}
