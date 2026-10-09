import {
    type DimseScuResult,
    getDimseConnectionArgs,
    runProcessAsync,
} from "./dimseScuRunner";

export type MovescuResult = DimseScuResult;

export type CMovePatientMatchingKey = "PatientID";

export type CMoveStudyMatchingKey = "StudyInstanceUID";

export type CMoveSeriesMatchingKey = "SeriesInstanceUID";

export type CMoveImageMatchingKey = "SOPInstanceUID";

export function getMoveDestinationAeTitle(): string {
    return process.env.TEST_MOVE_DEST_AE ?? "STORESCP_TEST";
}

export async function runMovescuPatient(
    matchingKey: CMovePatientMatchingKey,
    queryValue: string,
    moveDestination: string,
): Promise<MovescuResult> {
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
        "-aem",
        moveDestination,
        "-k",
        "QueryRetrieveLevel=PATIENT",
        "-k",
        `${matchingKey}=${queryValue}`,
    ];

    return runProcessAsync("movescu", args);
}

export async function runMovescuStudy(
    matchingKey: CMoveStudyMatchingKey,
    queryValue: string,
    moveDestination: string,
): Promise<MovescuResult> {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();
    const args = [
        "-v",
        "-S",
        host,
        port,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
        "-aem",
        moveDestination,
        "-k",
        "QueryRetrieveLevel=STUDY",
        "-k",
        `${matchingKey}=${queryValue}`,
    ];

    return runProcessAsync("movescu", args);
}

export async function runMovescuSeries(
    studyInstanceUid: string,
    matchingKey: CMoveSeriesMatchingKey,
    queryValue: string,
    moveDestination: string,
): Promise<MovescuResult> {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();
    const args = [
        "-v",
        "-S",
        host,
        port,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
        "-aem",
        moveDestination,
        "-k",
        "QueryRetrieveLevel=SERIES",
        "-k",
        `StudyInstanceUID=${studyInstanceUid}`,
        "-k",
        `${matchingKey}=${queryValue}`,
    ];

    return runProcessAsync("movescu", args);
}

export async function runMovescuImage(
    studyInstanceUid: string,
    seriesInstanceUid: string,
    matchingKey: CMoveImageMatchingKey,
    queryValue: string,
    moveDestination: string,
): Promise<MovescuResult> {
    const { host, port, calledAe, callingAe } = getDimseConnectionArgs();
    const args = [
        "-v",
        "-S",
        host,
        port,
        "-aec",
        calledAe,
        "-aet",
        callingAe,
        "-aem",
        moveDestination,
        "-k",
        "QueryRetrieveLevel=IMAGE",
        "-k",
        `StudyInstanceUID=${studyInstanceUid}`,
        "-k",
        `SeriesInstanceUID=${seriesInstanceUid}`,
        "-k",
        `${matchingKey}=${queryValue}`,
    ];

    return runProcessAsync("movescu", args);
}

export function getMovescuOutput(result: MovescuResult): string {
    return `${result.stdout}\n${result.stderr}`;
}

export function expectMovescuStatus(
    result: MovescuResult,
    statusHex: string,
): void {
    const output = getMovescuOutput(result);
    const statusValue = Number.parseInt(statusHex.replace(/^0x/i, ""), 16);
    const hexPatterns = [
        new RegExp(`\\b0x0*${statusValue.toString(16)}\\b`, "i"),
        new RegExp(`\\b0x${statusValue.toString(16)}\\b`, "i"),
    ];
    const textPatterns: RegExp[] = [];

    if (statusValue === 0xa801) {
        textPatterns.push(/MoveDestinationUnknown/i);
    }

    if (statusValue === 0x0112) {
        textPatterns.push(/NoSuchObjectInstance/i);
    }

    if (
        [...hexPatterns, ...textPatterns].some((pattern) =>
            pattern.test(output),
        )
    ) {
        return;
    }

    throw new Error(
        `Expected movescu output to contain status ${statusHex}, got:\n${output}`,
    );
}
