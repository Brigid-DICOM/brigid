
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