"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import type { SearchLevel } from "@/components/dicom/search/dicom-search-modal";
import { SEARCH_FIELD_CONFIGS } from "@/components/dicom/search/search-field-types";

interface UseUrlSearchParamsProps {
    searchLevel: SearchLevel;
    onSearchParamsChange: (searchParams: Record<string, string>) => void;
}

const getSupportedFieldsForLevel = (level: SearchLevel): Set<string> => {
    const configs = SEARCH_FIELD_CONFIGS[level];
    return new Set(configs.map((config) => config.key));
};

export function useUrlSearchParams({
    searchLevel,
    onSearchParamsChange,
}: UseUrlSearchParamsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const previousUrlRef = useRef<string>("");

    const getSearchParamsFromUrl = useCallback(() => {
        const params: Record<string, string> = {};
        const supportedFields = getSupportedFieldsForLevel(searchLevel);

        searchParams.forEach((value, key) => {
            if (value?.trim() && supportedFields.has(key)) {
                params[key] = value.trim();
            }
        });

        return params;
    }, [searchParams, searchLevel]);

    const syncSearchParamsToUrl = useCallback(
        (searchConditions: Record<string, string>) => {
            const currentParams = new URLSearchParams(
                Array.from(searchParams.entries()),
            );
            const supportedFields = getSupportedFieldsForLevel(searchLevel);

            supportedFields.forEach((field) => {
                currentParams.delete(field);
            });

            Object.entries(searchConditions).forEach(([key, value]) => {
                if (value?.trim() && supportedFields.has(key)) {
                    currentParams.set(key, value.trim());
                }
            });

            const search = currentParams.toString();
            const query = search ? `?${search}` : "";
            const newUrl = `${pathname}${query}`;

            if (newUrl !== previousUrlRef.current) {
                previousUrlRef.current = newUrl;
                router.replace(newUrl, { scroll: false });
            }
        },
        [pathname, router, searchParams, searchLevel],
    );

    const clearSearchParams = useCallback(() => {
        syncSearchParamsToUrl({});
    }, [syncSearchParamsToUrl]);

    const lastReportedParamsRef = useRef<string>("");

    useEffect(() => {
        const urlParams = getSearchParamsFromUrl();
        const paramsString = JSON.stringify(urlParams);

        if (paramsString === lastReportedParamsRef.current) return;

        lastReportedParamsRef.current = paramsString;
        if (Object.keys(urlParams).length > 0 && onSearchParamsChange) {
            onSearchParamsChange(urlParams);
        }
    }, [getSearchParamsFromUrl, onSearchParamsChange]);

    return {
        getSearchParamsFromUrl,
        syncSearchParamsToUrl,
        clearSearchParams,
    };
}
