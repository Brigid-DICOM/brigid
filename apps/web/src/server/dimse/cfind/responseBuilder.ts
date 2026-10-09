import type { DicomPersonName, DicomTag, DicomValue } from "@brigid/types";
import dcmjsDimse from "dcmjs-dimse";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import type { CFindMatchLayers } from "./types";

const DIRECTORY_RECORD_TYPE_TAG = "00041230";
const REFERENCED_SOP_CLASS_UID_IN_FILE_TAG = "00041510";
const REFERENCED_SOP_INSTANCE_UID_IN_FILE_TAG = "00041511";

const HEX_TAG_TO_KEYWORD = new Map<string, string>(
    Object.entries(DICOM_TAG_KEYWORD_REGISTRY).map(([keyword, entry]) => [
        entry.tag,
        keyword,
    ]),
);

function keywordToHexTag(keyword: string): string | undefined {
    const registryEntry =
        DICOM_TAG_KEYWORD_REGISTRY[
            keyword as keyof typeof DICOM_TAG_KEYWORD_REGISTRY
        ];
    return registryEntry?.tag;
}

function getKeywordVr(keyword: string): string {
    const registryEntry =
        DICOM_TAG_KEYWORD_REGISTRY[
            keyword as keyof typeof DICOM_TAG_KEYWORD_REGISTRY
        ];
    return registryEntry?.vr ?? "UN";
}

function keysContains(
    keysDataset: dcmjsDimse.Dataset,
    keyword: string,
): boolean {
    return keyword in keysDataset.getElements();
}

function parseDicomJson(json: string): DicomTag {
    return JSON.parse(json) as DicomTag;
}

function mergeDicomTags(...sources: DicomTag[]): DicomTag {
    const merged: DicomTag = {};
    for (const source of sources) {
        for (const [tag, element] of Object.entries(source)) {
            merged[tag] = element;
        }
    }
    return merged;
}

function formatDicomValue(value: DicomValue, vr: string): string | undefined {
    if (!value || value.length === 0) {
        return undefined;
    }

    if (vr === "PN") {
        const personNames = value as DicomPersonName[];
        const parts = personNames
            .map((personName) => personName.Alphabetic)
            .filter((name) => name.length > 0);
        if (parts.length === 0) {
            return undefined;
        }
        return parts.join("\\");
    }

    const parts = value
        .map((entry) => {
            if (typeof entry === "string") {
                return entry;
            }
            if (typeof entry === "number") {
                return String(entry);
            }
            return undefined;
        })
        .filter((entry): entry is string => entry !== undefined);

    if (parts.length === 0) {
        return undefined;
    }

    return parts.join("\\");
}

function dicomTagToDatasetElements(dicomTag: DicomTag): Record<string, string> {
    const elements: Record<string, string> = {};

    for (const [hexTag, element] of Object.entries(dicomTag)) {
        const keyword = HEX_TAG_TO_KEYWORD.get(hexTag);
        if (!keyword || !element.Value) {
            continue;
        }

        const formatted = formatDicomValue(element.Value, element.vr);
        if (formatted !== undefined) {
            elements[keyword] = formatted;
        }
    }

    return elements;
}

function basicAdjust(
    match: DicomTag,
    keysDataset: dcmjsDimse.Dataset,
): DicomTag {
    const keyKeywords = Object.keys(keysDataset.getElements());
    const filtered: DicomTag = {};

    if (!keysContains(keysDataset, "SpecificCharacterSet")) {
        const specificCharacterSetTag =
            DICOM_TAG_KEYWORD_REGISTRY.SpecificCharacterSet.tag;
        const specificCharacterSet = match[specificCharacterSetTag];
        if (
            specificCharacterSet?.Value &&
            specificCharacterSet.Value.length > 0
        ) {
            filtered[specificCharacterSetTag] = specificCharacterSet;
        } else {
            filtered[specificCharacterSetTag] = {
                vr: "CS",
                Value: ["ISO_IR 192"],
            };
        }
    }

    for (const keyword of keyKeywords) {
        const hexTag = keywordToHexTag(keyword);
        if (!hexTag) {
            continue;
        }

        const matchElement = match[hexTag];
        if (matchElement) {
            filtered[hexTag] = matchElement;
        }
    }

    for (const keyword of keyKeywords) {
        const hexTag = keywordToHexTag(keyword);
        if (!hexTag || filtered[hexTag]) {
            continue;
        }

        filtered[hexTag] = {
            vr: getKeywordVr(keyword),
            Value: [""],
        };
    }

    return filtered;
}

function patientAdjust(
    match: DicomTag,
    keysDataset: dcmjsDimse.Dataset,
): DicomTag {
    const basicAdjusted = basicAdjust(match, keysDataset);
    delete basicAdjusted[DIRECTORY_RECORD_TYPE_TAG];

    if (keysContains(keysDataset, "SOPClassUID")) {
        const sopClassUidTag = DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag;
        const referencedSopClassUid =
            match[REFERENCED_SOP_CLASS_UID_IN_FILE_TAG]?.Value?.[0];
        const sopClassUid =
            typeof referencedSopClassUid === "string"
                ? referencedSopClassUid
                : match[sopClassUidTag]?.Value?.[0];

        if (typeof sopClassUid === "string") {
            basicAdjusted[sopClassUidTag] = {
                vr: "UI",
                Value: [sopClassUid],
            };
        }
    }

    if (keysContains(keysDataset, "SOPInstanceUID")) {
        const sopInstanceUidTag = DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag;
        const referencedSopInstanceUid =
            match[REFERENCED_SOP_INSTANCE_UID_IN_FILE_TAG]?.Value?.[0];

        if (typeof referencedSopInstanceUid === "string") {
            basicAdjusted[sopInstanceUidTag] = {
                vr: "UI",
                Value: [referencedSopInstanceUid],
            };
        }
    }

    const queryRetrieveLevelTag =
        DICOM_TAG_KEYWORD_REGISTRY.QueryRetrieveLevel.tag;
    const queryRetrieveLevel = keysDataset.getElement("QueryRetrieveLevel");
    basicAdjusted[queryRetrieveLevelTag] = {
        vr: "CS",
        Value: [queryRetrieveLevel ?? ""],
    };

    return basicAdjusted;
}

export function buildResponseDataset(
    layers: CFindMatchLayers,
    keysDataset: dcmjsDimse.Dataset,
): dcmjsDimse.Dataset {
    const merged = mergeDicomTags(
        layers.patient ?? {},
        layers.study ?? {},
        layers.series ?? {},
        layers.instance ?? {},
    );
    const adjusted = patientAdjust(merged, keysDataset);
    return new dcmjsDimse.Dataset(dicomTagToDatasetElements(adjusted));
}

export function parseEntityDicomJson(json: string): DicomTag {
    return parseDicomJson(json);
}
