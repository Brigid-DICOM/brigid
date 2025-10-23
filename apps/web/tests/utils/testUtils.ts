import { DICOM_TAG_KEYWORD_REGISTRY } from "@/server/const/dicomTagKeywordRegistry";

export interface SearchDicomTestOptions {
    queryParamPath: string;
    title?: string; // optional title for the test
    searchValue: string;
    expectedCount: number;
    statusCode?: number;
    expectDicomValue?: {
        tag: string;
        value: string | number,
        index?: number;
    };

    customAssertion?: (items: any[], response: Response) => Promise<void>;
}

export function keywordPathToTagPath(keywordPath: string): string {
    const keywords = keywordPath.split(".");

    const tags = keywords.map((keyword) => {
        const tagInfo = DICOM_TAG_KEYWORD_REGISTRY[keyword as keyof typeof DICOM_TAG_KEYWORD_REGISTRY];

        if (!tagInfo) {
            throw new Error(`Keyword ${keyword} not found in DICOM_TAG_KEYWORD_REGISTRY`);
        }

        return tagInfo.tag;
    });

    return tags.join(".");
}