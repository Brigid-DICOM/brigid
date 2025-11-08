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

export const SEARCH_TYPE_CONFIGS: SearchTypeConfig[] = [
    {
        key: "dicom-study",
        label: "DICOM Studies",
        description: "Search for DICOM studies",
        dicomLevel: "study",
        routePattern: /^\/dicom-studies(?:\?.*)?$/,
    },
    {
        key: "dicom-series",
        label: "DICOM Series",
        description: "Search for DICOM series",
        dicomLevel: "series",
        routePattern: /^\/dicom-studies\/([\d.]+)(?:\?.*)?$/,
    },
    {
        key: "dicom-instance",
        label: "DICOM Instance",
        description: "Search for DICOM instances",
        dicomLevel: "instance",
        routePattern: /^\/dicom-studies\/([\d.]+)\/series\/([\d.]+)(?:\?.*)?$/,
    },
]

export function getSearchTypeFromRoute(pathname: string): SearchType | null {
    const config = SEARCH_TYPE_CONFIGS.find((config) => 
        config.routePattern?.test(pathname)
    );
    return config?.key || null;
}

export function getSearchTypeConfig(type: SearchType): SearchTypeConfig | undefined {
    return SEARCH_TYPE_CONFIGS.find((config) => config.key === type);
}