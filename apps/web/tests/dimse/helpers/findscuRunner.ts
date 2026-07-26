import { spawn } from "node:child_process";

export interface FindscuResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

export type CFindMatchingKey =
    | "PatientID"
    | "PatientName"
    | "PatientBirthDate";

const RETURN_KEYS: readonly CFindMatchingKey[] = [
    "PatientID",
    "PatientName",
    "PatientBirthDate",
];

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
): Promise<FindscuResult> {
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

export async function runFindscu(
    matchingKey: CFindMatchingKey,
    queryValue: string,
): Promise<FindscuResult> {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();
    const args = [
        "-v",
        "-P",
        host,
        port,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
        "-k",
        "QueryRetrieveLevel=PATIENT",
    ];

    for (const key of RETURN_KEYS) {
        if (key === matchingKey) {
            args.push("-k", `${key}=${queryValue}`);
        } else {
            args.push("-k", `${key}=`);
        }
    }

    return runProcess("findscu", args);
}
