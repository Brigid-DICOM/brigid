import {
    type DimseScuResult,
    getDimseConnectionArgs,
    runProcessAsync,
} from "./dimseScuRunner";

export type FindscuResult = DimseScuResult;

export type CFindMatchingKey =
    | "PatientID"
    | "PatientName"
    | "PatientBirthDate";

const RETURN_KEYS: readonly CFindMatchingKey[] = [
    "PatientID",
    "PatientName",
    "PatientBirthDate",
];

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

    return runProcessAsync("findscu", args);
}
