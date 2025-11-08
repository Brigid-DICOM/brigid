"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { SearchCondition } from "@/components/dicom/search/dicom-search-condition-item";

export type SearchType = "dicom-study" | "dicom-series" | "dicom-instance";

export interface GlobalSearchState {
    searchType: SearchType | null;
    searchConditions: Record<string, string>;

    setSearchType: (type: SearchType | null) => void;
    setSearchConditions: (conditions: Record<string, string>) => void;
    executeSearch: (type: SearchType, conditions: SearchCondition[]) => void;
    clearSearch: () => void;
    getSearchConditionsForType: (type: SearchType) => Record<string, string>;
}

export const useGlobalSearchStore = create<GlobalSearchState>()(
    devtools(
        persist(
            (set, get) => ({
                searchType: null,
                searchConditions: {},

                setSearchType: (type: SearchType | null) => {
                    set({ searchType: type });
                },

                setSearchConditions: (conditions: Record<string, string>) => {
                    set({ searchConditions: conditions });
                },

                executeSearch: (type: SearchType, conditions: SearchCondition[]) => {
                    const searchParams = conditions.reduce((acc, condition) => {
                        acc[condition.field] = condition.value;
                        return acc;
                    }, {} as Record<string, string>);

                    set({
                        searchType: type,
                        searchConditions: searchParams
                    });
                },

                clearSearch: () => {
                    set({ searchType: null, searchConditions: {} });
                },

                getSearchConditionsForType: (type: SearchType) => {
                    const state = get();
                    return state.searchType === type ? state.searchConditions : {};
                },
            }),
            {
                name: "global-search",
            }
        ),
        {
            name: "global-search",
        },
    ),
)