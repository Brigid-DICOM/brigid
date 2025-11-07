
export type DicomPersonName = {
    Alphabetic: string;
    Ideographic?: string;
    Phonetic?: string;
};

export type DicomValue = 
    | string[]
    | number[]
    | DicomTag[]
    | DicomPersonName[];

export type DicomElement = {
    vr: string;
    Value?: DicomValue;
    BulkDataURI?: string;
    InlineBinary?: string;
};

export type DicomTag = {
    [tag: string]: DicomElement;
};

export type ReferencedSopClassUid = {
    vr: "UI";
    Value: string[];
}

export type ReferencedSopInstanceUid = {
    vr: "UI";
    Value: string[];
}

export type SopInstanceReference = {
    "00081150": ReferencedSopClassUid;
    "00081155": ReferencedSopInstanceUid;
    "00081190"?: {
        vr: "UR";
        Value: string[];
    }
}

// #region DICOM QIDO Response Data

export interface DicomStudyData {
    "00080061"?: { Value: [string] }; // Modalities In Study
    "00080020"?: { Value: [string] }; // Study Date
    "00080030"?: { Value: [string] }; // Study Time
    "00080050"?: { Value: [string] }; // Accession Number
    "00080090"?: { Value: [DicomPersonName] }; // Referring Physician Name
    "00100010"?: { Value: [DicomPersonName] }; // Patient Name
    "00100020": { Value: [string] }; // Patient ID
    "00100030"?: { Value: [string] }; // Patient Birth Date
    "0020000D": { Value: [string] }; // Study Instance UID
    "00200010"?: { Value: [string] }; // Study ID
    [key: string]: any;
}

export interface DicomSeriesData {
    "00080060": { Value: [string] }; // Modality
    "00080021"?: { Value: [string] }; // Series Date
    "0008103E"?: { Value: [string] }; // Series Description
    "0020000E": { Value: [string] }; // Series Instance UID
    "00200011"?: { Value: [number] }; // Series Number
    "00201209"?: { Value: [number] }; // Number of Series Related Instances
    "00400244"?: { Value: [string] }; // Performed Procedure Step Start Date
    "00400245"?: { Value: [string] }; // Performed Procedure Step Start Time
    [key: string]: any;
}

export interface DicomInstanceData {
    "00080016": { Value: [string] }; // SOP Class UID
    "00080018": { Value: [string] }; // SOP Instance UID
    "00080022"?: { Value: [string] }; // Acquisition Date
    "00080023"?: { Value: [string] }; // Content Date
    "00200013": { Value: [number] }; // Instance Number
    [key: string]: any;
}

// #endregion DICOM QIDO Response Data