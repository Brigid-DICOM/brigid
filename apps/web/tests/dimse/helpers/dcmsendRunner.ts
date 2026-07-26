import {
    assertDcmtkInstalled,
    type DimseScuResult,
    getDimseConnectionArgs,
    runProcessAsync,
    runProcessSync,
} from "./dimseScuRunner";

export { assertDcmtkInstalled };

export type DcmsendResult = DimseScuResult;

export function runEchoscu(): DcmsendResult {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();

    return runProcessSync("echoscu", [
        host,
        port,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
    ]);
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
    return runProcessAsync("dcmsend", args);
}
