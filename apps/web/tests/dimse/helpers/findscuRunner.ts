import {
    type DimseScuResult,
    getDimseConnectionArgs,
    runProcessAsync,
} from "./dimseScuRunner";

export type FindscuResult = DimseScuResult;

export type CFindMatchingKey = "PatientID" | "PatientName" | "PatientBirthDate";

export type CFindStudyMatchingKey =
    | "PatientID"
    | "PatientName"
    | "StudyInstanceUID"
    | "StudyDate"
    | "StudyTime"
    | "AccessionNumber"
    | "ModalitiesInStudy"
    | "StudyID"
    | "ReferringPhysicianName";

export type CFindSeriesMatchingKey =
    | "Modality"
    | "SeriesInstanceUID"
    | "SeriesNumber"
    | "SeriesDate"
    | "SeriesDescription";

export type CFindImageMatchingKey =
    | "SOPClassUID"
    | "SOPInstanceUID"
    | "InstanceNumber"
    | "ContentDate"
    | "ContentTime";

const RETURN_KEYS: readonly CFindMatchingKey[] = [
    "PatientID",
    "PatientName",
    "PatientBirthDate",
];

const STUDY_RETURN_KEYS: readonly CFindStudyMatchingKey[] = [
    "PatientID",
    "PatientName",
    "StudyInstanceUID",
    "StudyDate",
    "StudyTime",
    "AccessionNumber",
    "ModalitiesInStudy",
    "StudyID",
    "ReferringPhysicianName",
];

const SERIES_RETURN_KEYS: readonly (CFindSeriesMatchingKey | "PatientID")[] = [
    "Modality",
    "SeriesInstanceUID",
    "SeriesNumber",
    "SeriesDate",
    "SeriesDescription",
    "PatientID",
];

const IMAGE_RETURN_KEYS: readonly (CFindImageMatchingKey | "PatientID")[] = [
    "SOPClassUID",
    "SOPInstanceUID",
    "InstanceNumber",
    "ContentDate",
    "ContentTime",
    "PatientID",
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

export async function runFindscuStudy(
    matchingKey: CFindStudyMatchingKey,
    queryValue: string,
): Promise<FindscuResult> {
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
        "-k",
        "QueryRetrieveLevel=STUDY",
    ];

    for (const key of STUDY_RETURN_KEYS) {
        if (key === matchingKey) {
            args.push("-k", `${key}=${queryValue}`);
        } else {
            args.push("-k", `${key}=`);
        }
    }

    return runProcessAsync("findscu", args);
}

export async function runFindscuSeries(
    studyInstanceUid: string,
    matchingKey: CFindSeriesMatchingKey,
    queryValue: string,
): Promise<FindscuResult> {
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
        "-k",
        "QueryRetrieveLevel=SERIES",
        "-k",
        `StudyInstanceUID=${studyInstanceUid}`,
    ];

    for (const key of SERIES_RETURN_KEYS) {
        if (key === matchingKey) {
            args.push("-k", `${key}=${queryValue}`);
        } else {
            args.push("-k", `${key}=`);
        }
    }

    return runProcessAsync("findscu", args);
}

export async function runFindscuImage(
    studyInstanceUid: string,
    seriesInstanceUid: string,
    matchingKey: CFindImageMatchingKey,
    queryValue: string,
): Promise<FindscuResult> {
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
        "-k",
        "QueryRetrieveLevel=IMAGE",
        "-k",
        `StudyInstanceUID=${studyInstanceUid}`,
        "-k",
        `SeriesInstanceUID=${seriesInstanceUid}`,
    ];

    for (const key of IMAGE_RETURN_KEYS) {
        if (key === matchingKey) {
            args.push("-k", `${key}=${queryValue}`);
        } else {
            args.push("-k", `${key}=`);
        }
    }

    return runProcessAsync("findscu", args);
}
