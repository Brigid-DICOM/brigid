import type { DicomPersonName } from "@brigid/types";
import type dcmjsDimse from "dcmjs-dimse";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { CFindQueryLevel } from "./types";

const HEX_TAG_TO_KEYWORD = new Map<string, string>(
    Object.entries(DICOM_TAG_KEYWORD_REGISTRY).map(([keyword, entry]) => [
        entry.tag.toUpperCase(),
        keyword,
    ]),
);

const QUERY_KEYWORDS_BY_LEVEL: Record<CFindQueryLevel, readonly string[]> = {
    patient: ["PatientName", "PatientID", "PatientBirthDate"],
    study: [
        "PatientID",
        "PatientName",
        "StudyInstanceUID",
        "StudyDate",
        "StudyTime",
        "AccessionNumber",
        "ModalitiesInStudy",
        "StudyID",
        "ReferringPhysicianName",
    ],
    series: [
        "PatientID",
        "PatientName",
        "StudyInstanceUID",
        "StudyDate",
        "StudyTime",
        "AccessionNumber",
        "StudyID",
        "ReferringPhysicianName",
        "SeriesInstanceUID",
        "Modality",
        "SeriesNumber",
        "SeriesDescription",
        "SeriesDate",
    ],
    instance: [
        "PatientID",
        "PatientName",
        "StudyInstanceUID",
        "StudyDate",
        "StudyTime",
        "AccessionNumber",
        "StudyID",
        "ReferringPhysicianName",
        "SeriesInstanceUID",
        "Modality",
        "SeriesNumber",
        "SeriesDescription",
        "SeriesDate",
        "SOPInstanceUID",
        "SOPClassUID",
        "InstanceNumber",
        "ContentDate",
        "ContentTime",
    ],
};

const NUMBER_QUERY_KEYWORDS = new Set<string>([
    "SeriesNumber",
    "InstanceNumber",
]);

const DATE_QUERY_KEYWORDS = new Set<string>([
    "StudyDate",
    "SeriesDate",
    "ContentDate",
    "PatientBirthDate",
]);

function keywordToHexTag(keyword: string): string | undefined {
    const registryEntry =
        DICOM_TAG_KEYWORD_REGISTRY[
            keyword as keyof typeof DICOM_TAG_KEYWORD_REGISTRY
        ];
    return registryEntry?.tag;
}

function normalizeDicomMultiValue(value: string): string {
    if (value.includes("\\")) {
        return value.replace(/\\/g, ",");
    }

    return value;
}

function resolveKeyword(key: string): string {
    if (/^[0-9A-Fa-f]{8}$/.test(key)) {
        return HEX_TAG_TO_KEYWORD.get(key.toUpperCase()) ?? key;
    }

    return key;
}

function extractPersonName(value: unknown): string | undefined {
    if (typeof value === "string") {
        return value.length > 0 ? value : undefined;
    }

    if (typeof value === "object" && value !== null && "Alphabetic" in value) {
        const alphabetic = (value as DicomPersonName).Alphabetic;
        return alphabetic.length > 0 ? alphabetic : undefined;
    }

    return undefined;
}

function extractDatasetStringValue(
    value: unknown,
    keyword?: string,
): string | undefined {
    if (typeof value === "number") {
        if (!keyword || !NUMBER_QUERY_KEYWORDS.has(keyword)) {
            return undefined;
        }

        return String(value);
    }

    if (typeof value === "string") {
        const normalized =
            keyword && DATE_QUERY_KEYWORDS.has(keyword)
                ? value.trim()
                : value;
        return normalized.length > 0 ? normalized : undefined;
    }

    if (Array.isArray(value)) {
        if (keyword && NUMBER_QUERY_KEYWORDS.has(keyword)) {
            const parts = value
                .map((entry) => {
                    if (typeof entry === "number") {
                        return String(entry);
                    }

                    if (typeof entry === "string" && entry.length > 0) {
                        return entry;
                    }

                    return undefined;
                })
                .filter((entry): entry is string => entry !== undefined);

            if (parts.length === 0) {
                return undefined;
            }

            return parts.join(",");
        }

        const parts = value
            .map((entry) => extractPersonName(entry))
            .filter((entry): entry is string => entry !== undefined);

        if (parts.length === 0) {
            return undefined;
        }

        return parts.join("\\");
    }

    return extractPersonName(value);
}

export function datasetToJsonQuery(
    level: CFindQueryLevel,
    dataset: dcmjsDimse.Dataset,
): Record<string, string> {
    const query: Record<string, string> = {};
    const keywords = QUERY_KEYWORDS_BY_LEVEL[level];
    const keywordSet = new Set<string>(keywords);

    const setQueryValue = (keyword: string, extractedValue: string) => {
        const normalizedValue = normalizeDicomMultiValue(extractedValue);
        const hexTag = keywordToHexTag(keyword);
        if (hexTag) {
            query[hexTag] = normalizedValue;
        }
        query[keyword] = normalizedValue;
    };

    const addQueryValue = (rawKey: string, rawValue: unknown) => {
        const keyword = resolveKeyword(rawKey);
        if (!keywordSet.has(keyword)) {
            return;
        }

        const extractedValue = extractDatasetStringValue(rawValue, keyword);
        if (!extractedValue) {
            return;
        }

        setQueryValue(keyword, extractedValue);
    };

    for (const [key, value] of Object.entries(dataset.getElements())) {
        if (key === "_vrMap") {
            continue;
        }

        addQueryValue(key, value);
    }

    for (const keyword of keywords) {
        const value = dataset.getElement(keyword);
        if (typeof value === "string" && value.trim().length > 0) {
            addQueryValue(keyword, value);
        }
    }

    return query;
}
