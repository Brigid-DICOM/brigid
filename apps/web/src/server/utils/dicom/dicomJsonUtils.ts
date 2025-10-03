import type { DicomTag } from "@brigid/types";
import { JSONPath } from "jsonpath-plus";
import { cloneDeep, omit } from "lodash";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";

const BIG_VALUE_TAGS = [
    "52009230",
    "00480200"
]

export class DicomJsonUtils {
    private dicomJson: DicomTag;
    private bigValueJson: DicomTag;

    constructor(dicomJson: DicomTag, ...selection: string[]) {
        console.log("dicomJson", dicomJson);
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
                const propPath = (pointer as string).split("/").slice(1).join(".");
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
                const propPath = (pointer as string).split("/").slice(1).join(".");
                selectionDicomJson[propPath] = value;
            }
        }

        this.dicomJson = selectionDicomJson;
    }

    getUidCollection() {
        return {
            sopClassUid: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.SOPClassUID.tag]?.Value?.[0],
            patientId: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.PatientID.tag]?.Value?.[0],
            studyInstanceUid: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.StudyInstanceUID.tag]?.Value?.[0],
            seriesInstanceUid: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.SeriesInstanceUID.tag]?.Value?.[0],
            sopInstanceUid: this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.SOPInstanceUID.tag]?.Value?.[0],
        }
    }
}