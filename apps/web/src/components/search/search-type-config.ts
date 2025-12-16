import type { SearchType } from "@/stores/global-search-store";
import type { SearchLevel } from "../dicom/search/dicom-search-modal";

export interface SearchTypeConfig {
    key: SearchType;
    label: string;
    description: string;
    dicomLevel?: SearchLevel;
    icon?: string;
    routePattern?: RegExp;
}

// 語言代碼 pattern: 匹配 xx 或 xx-XX 格式 (如 en, zh-TW)
const LNG_PATTERN = "[a-z]{2}(?:-[A-Z]{2})?";

export const SEARCH_TYPE_CONFIGS: SearchTypeConfig[] = [
    {
        key: "dicom-study",
        label: "DICOM Studies",
        description: "Search for DICOM studies",
        dicomLevel: "study",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-studies(?:\\?.*)?$`,
        ),
    },
    {
        key: "dicom-series",
        label: "DICOM Series",
        description: "Search for DICOM series",
        dicomLevel: "series",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-studies\\/[\\d.]+(?:\\?.*)?$`,
        ),
    },
    {
        key: "dicom-instance",
        label: "DICOM Instance",
        description: "Search for DICOM instances",
        dicomLevel: "instance",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-studies\\/[\\d.]+\\/series\\/[\\d.]+(?:\\?.*)?$`,
        ),
    },
    {
        key: "dicom-recycle-study",
        label: "DICOM Recycle Studies",
        description: "Search for DICOM recycle studies",
        dicomLevel: "recycle-study",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-recycle\\/studies(?:\\?.*)?$`,
        ),
    },
    {
        key: "dicom-recycle-series",
        label: "DICOM Recycle Series",
        description: "Search for DICOM recycle series",
        dicomLevel: "recycle-series",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-recycle\\/studies\\/[\\d.]+\\/series(?:\\?.*)?$`,
        ),
    },
    {
        key: "dicom-recycle-instance",
        label: "DICOM Recycle Instance",
        description: "Search for DICOM recycle instances",
        dicomLevel: "recycle-instance",
        routePattern: new RegExp(
            `^\\/${LNG_PATTERN}\\/[\\w-]+\\/dicom-recycle\\/studies\\/[\\d.]+\\/series\\/[\\d.]+\\/instances(?:\\?.*)?$`,
        ),
    },
];

export function getSearchTypeFromRoute(pathname: string): SearchType | null {
    const config = SEARCH_TYPE_CONFIGS.find((config) =>
        config.routePattern?.test(pathname),
    );
    return config?.key || null;
}

export function getSearchTypeConfig(
    type: SearchType,
): SearchTypeConfig | undefined {
    return SEARCH_TYPE_CONFIGS.find((config) => config.key === type);
}
