import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { join } from "desm";

const DCM4CHE_INSTALL_HINT =
    "Vendored dcm4che tools are expected at apps/web/tests/tools/dcm4che. Override with TEST_DCM4CHE_TOOL_ROOT.";

export function getDcm4cheToolRoot(): string {
    const configured = process.env.TEST_DCM4CHE_TOOL_ROOT;
    if (configured) {
        return path.isAbsolute(configured)
            ? configured
            : path.resolve(process.cwd(), configured);
    }

    return path.resolve(join(import.meta.url, "../../tools/dcm4che"));
}

export function getStgcmtscuExecutable(): string {
    const executable =
        process.platform === "win32" ? "stgcmtscu.bat" : "stgcmtscu";
    return path.join(getDcm4cheToolRoot(), "bin", executable);
}

export function assertJavaInstalled(): void {
    const result = spawnSync("java", ["-version"], {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32",
    });

    const output = [result.stdout, result.stderr, result.error?.message]
        .filter(Boolean)
        .join("\n");

    if (result.status !== 0 || !/version/i.test(output)) {
        throw new Error(
            `Java runtime not found. Set JAVA_HOME or add java to PATH.\n${output}`,
        );
    }
}

export function assertDcm4cheToolInstalled(): void {
    assertJavaInstalled();

    const executable = getStgcmtscuExecutable();
    const mainJar = path.join(
        getDcm4cheToolRoot(),
        "lib",
        "dcm4che-tool-stgcmtscu-5.34.1.jar",
    );
    if (!fs.existsSync(executable) || !fs.existsSync(mainJar)) {
        throw new Error(
            `stgcmtscu not found at ${executable}.\n${DCM4CHE_INSTALL_HINT}`,
        );
    }
}
