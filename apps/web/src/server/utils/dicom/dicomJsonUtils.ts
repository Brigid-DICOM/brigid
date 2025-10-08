import env from "@brigid/env";
import type { DicomTag } from "@brigid/types";
import { JSONPath } from "jsonpath-plus";
import { cloneDeep, omit } from "lodash";
import {
    DICOM_MEDIA_STORAGE_ID,
    DICOM_MEDIA_STORAGE_UID
} from "@/server/const/dicom.const";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import { createHash } from "../createHash";
import { appLogger } from "../logger";

const logger = appLogger.child({
    module: "DicomJsonUtils"
});

const BIG_VALUE_TAGS = ["52009230", "00480200"];

export class DicomJsonUtils {
    private dicomJson: DicomTag;
    private bigValueJson: DicomTag;

    constructor(dicomJson: DicomTag, ...selection: string[]) {
        this.dicomJson = dicomJson;
        this.bigValueJson = {};

        this.initSelection(selection);
    }

    getMinifyDicomJson() {
        const clonedDicomJson = cloneDeep(this.dicomJson);
        omit(clonedDicomJson, BIG_VALUE_TAGS);

        // temporary store big value tags in bigValueJson
        for (const tag of BIG_VALUE_TAGS) {
            const hitJsonPath = JSONPath({
                json: this.dicomJson,
                path: `$..['${tag}']`,
                resultType: "all"
            });

            if (hitJsonPath.length > 0) {
                const { value, pointer } = hitJsonPath[0];
                const propPath = (pointer as string)
                    .split("/")
                    .slice(1)
                    .join(".");
                this.bigValueJson[propPath] = value;
            }
        }

        return clonedDicomJson;
    }

    private initSelection(selection: string[]) {
        if (selection.length === 0) {
            return;
        }

        const selectionDicomJson: DicomTag = {};

        for (const tag of selection) {
            const sanitizedTag = tag.split(".").join("Value[*]");
            const hitJsonPath = JSONPath({
                json: this.dicomJson,
                path: sanitizedTag,
                resultType: "all"
            });

            if (hitJsonPath.length > 0) {
                const { value, pointer } = hitJsonPath[0];
                const propPath = (pointer as string)
                    .split("/")
                    .slice(1)
                    .join(".");
                selectionDicomJson[propPath] = value;
            }
        }

        this.dicomJson = selectionDicomJson;
    }

    getUidCollection() {
        return {
            sopClassUid: this.dicomJson[
                DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag
            ]?.Value?.[0] as string,
            patientId: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag]
                ?.Value?.[0] as string,
            studyInstanceUid: this.dicomJson[
                DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag
            ]?.Value?.[0] as string,
            seriesInstanceUid: this.dicomJson[
                DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag
            ]?.Value?.[0] as string,
            sopInstanceUid: this.dicomJson[
                DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag
            ]?.Value?.[0] as string
        };
    }

    /**
     * 根據環境變數中定義的路徑格式產生 DICOM 檔案的儲存路徑
     * 支援格式: {ggggeeee} 或 {ggggeeee,hash}
     * - ggggeeee: DICOM tag (8位16進制)
     * - hash: 將tag值進行hash處理
     *
     * @param pathPattern - 路徑 pattern，預設使用環境變數 DICOM_STORAGE_FILEPATH
     */
    getFilePath(pathPattern?: string) {
        const pattern = pathPattern || env.DICOM_STORAGE_FILEPATH;

        const regex = /\{([0-9A-Fa-f]{8})(?:,(hash))?\}/g;

        return pattern.replace(
            regex,
            (match: string, tagHex: string, shouldHash: string) => {
                const tagValue = this.dicomJson[tagHex]?.Value?.[0] as
                    | string
                    | undefined;

                if (!tagValue) {
                    logger.warn(`Tag ${tagHex} not found in DICOM JSON`);
                    return match;
                }

                if (shouldHash) {
                    return createHash(tagValue as string);
                }

                return tagValue as string;
            }
        );
    }

    getStudyPath(pathPattern?: string) {
        return this.getPathUntilTag("0020000D", pathPattern);
    }

    getSeriesPath(pathPattern?: string) {
        return this.getPathUntilTag("0020000E", pathPattern);
    }

    private getPathUntilTag(tagHex: string, pathPattern?: string) {
        const pattern = pathPattern || env.DICOM_STORAGE_FILEPATH;

        const hasLeadingSlash = pattern.startsWith("/");
        const segments = pattern.split("/").filter((s) => s.length > 0);

        // Parse {ggggeeee} or {ggggeeee,hash}
        const placeholderRegex = /\{([0-9A-Fa-f]{8})(?:,(hash))?\}/g;

        const stopOnTagRegex = new RegExp(`\\{(${tagHex})(?:,(hash))?\\}`, "i");

        const out: string[] = [];

        for (const segment of segments) {
            const replaced = segment.replace(
                placeholderRegex,
                (match: string, foundTagHex: string, shouldHash: string) => {
                    const tagValue = this.dicomJson[foundTagHex]?.Value?.[0] as
                        | string
                        | undefined;

                    // If the tag is missing, keep original and log a warning to avoid broken path
                    if (!tagValue) {
                        logger.warn(
                            `Tag ${foundTagHex} not found in DICOM JSON`
                        );
                        return match;
                    }

                    return shouldHash
                        ? createHash(tagValue as string)
                        : (tagValue as string);
                }
            );

            out.push(replaced);

            if (stopOnTagRegex.test(replaced)) {
                break;
            }
        }

        return (hasLeadingSlash ? "/" : "") + out.join("/");
    }

    getMediaStorageInfo() {
        return {
            "00880130": {
                vr: "SH",
                Value: [DICOM_MEDIA_STORAGE_ID]
            },
            "00880140": {
                vr: "UI",
                Value: [DICOM_MEDIA_STORAGE_UID]
            }
        };
    }

    getSelectionDicomJson(selection: string[]) {
        const selectionDicomJson: DicomTag = {};

        for (const tag of selection) {
            const sanitizedTag = tag.split(".").join("Value[*]");
            const hitJsonPath = JSONPath({
                json: this.dicomJson,
                path: sanitizedTag,
                resultType: "all"
            });

            if (hitJsonPath.length > 0) {
                const { value, pointer } = hitJsonPath[0];
                const propPath = (pointer as string)
                    .split("/")
                    .slice(1)
                    .join(".");
                selectionDicomJson[propPath] = value;
            }
        }

        return selectionDicomJson;
    }

    getValue<T>(tag: string): T | undefined {
        const element = this.dicomJson[tag];

        if (
            element &&
            Array.isArray(element.Value) &&
            element.Value.length > 0
        ) {
            return element.Value[0] as T;
        }

        return undefined;
    }
}
