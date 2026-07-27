import type { DicomTag } from "@brigid/types";

export type CFindQueryLevel = "patient" | "study" | "series" | "instance";

export type CFindRetrieveLevel =
    | "PATIENT"
    | "STUDY"
    | "SERIES"
    | "IMAGE";

export type CFindInfoModel = "patientRoot" | "studyRoot";

export interface CFindMatchLayers {
    patient?: DicomTag;
    study?: DicomTag;
    series?: DicomTag;
    instance?: DicomTag;
}

export type CFindMatchFetcher = (
    workspaceId: string,
    queryJson: Record<string, string>,
    offset: number,
) => Promise<CFindMatchLayers | null>;
