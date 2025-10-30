import type { DicomTag } from "@brigid/types";
import { JSONPath } from "jsonpath-plus";
import { get, set, unset } from "lodash";
import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";
import { DicomJsonUtils } from "./dicomJsonUtils";

export class DicomJsonBinaryDataUtils {
    private readonly dicomJson: DicomTag;
    private binaryKeys: string[] | undefined = undefined;
    private binaryPropKeys: string[] | undefined = undefined;

    constructor(dicomJson: DicomTag, private workspaceId: string) {
        this.dicomJson = dicomJson;
        this.getBinaryKeys();
        this.getBinaryPropKeys();
    }

    private getBinaryKeys() {
        if (this.binaryKeys) {
            return this.binaryKeys;
        }

        let binaryKeys = JSONPath({
            json: this.dicomJson,
            path: "$..[?(@ && @.vr && (@.vr === 'OB' || @.vr === 'OD' || @.vr === 'OF' || @.vr === 'OL' || @.vr === 'OV' || @.vr === 'OW'))]",
            resultType: "path"
        }) || [];

        if (binaryKeys.length > 0) {
            binaryKeys = binaryKeys.map((key: string) => {
                const pathArray = JSONPath.toPathArray(key);
                // remove $ symbol
                pathArray.shift();

                return pathArray.join(".");
            });
        }
        this.binaryKeys = binaryKeys;

        return binaryKeys;
    }

    private getBinaryPropKeys() {
        if (!this.binaryKeys) {
            return [];
        }

        if (this.binaryPropKeys) {
            return this.binaryPropKeys;
        }

        const binaryPropKeys = [];

        for (const key of this.binaryKeys) {
            const commonProps = get(this.dicomJson, `${key}.Value.0`);
            const inlineBinaryProps = get(this.dicomJson, `${key}.InlineBinary`);

            if (commonProps) {
                binaryPropKeys.push(`${key}.Value.0`);
            } else if (inlineBinaryProps) {
                binaryPropKeys.push(`${key}.InlineBinary`);
            }
        }

        this.binaryPropKeys = binaryPropKeys;
        return binaryPropKeys;
    }

    replaceBinaryPropsToUriProp() {
        if (!this.binaryKeys || !this.binaryPropKeys) {
            return this.dicomJson;
        }

        const dicomJsonUtils = new DicomJsonUtils(this.dicomJson);
        const { studyInstanceUid, seriesInstanceUid, sopInstanceUid } = dicomJsonUtils.getUidCollection();

        for (let i = 0 ; i < this.binaryKeys.length; i++) {
            const binaryKey = this.binaryKeys[i];

            set(
                this.dicomJson,
                `${binaryKey}.vr`,
                "UR"
            );

            const binaryPropKey = this.binaryPropKeys[i];

            set(
                this.dicomJson,
                `${binaryKey}.BulkDataURI`,
                `/workspaces/${this.workspaceId}/studies/${studyInstanceUid}/series/${seriesInstanceUid}/instances/${sopInstanceUid}/bulkdata/${binaryPropKey}`
            );

            unset(
                this.dicomJson,
                `${binaryKey}.Value`
            );
            unset(
                this.dicomJson,
                `${binaryKey}.InlineBinary`
            );

            this.dicomJson[DICOM_TAG_KEYWORD_REGISTRY.PixelData.tag] = {
                vr: "UR",
                BulkDataURI: `/workspaces/${this.workspaceId}/studies/${studyInstanceUid}/series/${seriesInstanceUid}/instances/${sopInstanceUid}/bulkdata/${binaryPropKey}`
            };
        }
    }
}