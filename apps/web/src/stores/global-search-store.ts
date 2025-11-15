"use client";

import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import type { SearchCondition } from "@/components/dicom/search/dicom-search-condition-item";

export type SearchType = "dicom-study" | "dicom-series" | "dicom-instance";

export interface GlobalSearchState {
    searchType: SearchType | null;
    searchConditions: Record<string, string>;
    searchConditionsByType: Record<SearchType, Record<string, string>>;

    setSearchType: (type: SearchType | null) => void;
    setSearchConditions: (conditions: Record<string, string>) => void;
    setSearchConditionsForType: (type: SearchType, conditions: Record<string, string>) => void;
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
                searchConditionsByType: {
                    "dicom-study": {},
                    "dicom-series": {},
                    "dicom-instance": {},
                },

                setSearchType: (type: SearchType | null) => {
                    set({ searchType: type });
                },

                setSearchConditions: (conditions: Record<string, string>) => {
                    const state = get();
                    set({ 
                        searchConditions: conditions,
                        ...(state.searchType && {
                            searchConditionsByType: {
                                ...state.searchConditionsByType,
                                [state.searchType]: conditions
                            }
                        })
                    });
                },

                setSearchConditionsForType: (type: SearchType, conditions: Record<string, string>) => {
                    const state = get();
                    set({
                        searchConditions: state.searchType === type ? conditions : state.searchConditions,
                        searchConditionsByType: {
                            ...state.searchConditionsByType,
                            [type]: conditions,
                        },
                    })
                },

                executeSearch: (type: SearchType, conditions: SearchCondition[]) => {
                    const searchParams = conditions.reduce((acc, condition) => {
                        acc[condition.field] = condition.value;
                        return acc;
                    }, {} as Record<string, string>);

                    set({
                        searchType: type,
                        searchConditions: searchParams,
                        searchConditionsByType: {
                            ...get().searchConditionsByType,
                            [type]: searchParams
                        }
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
                storage: createJSONStorage(() => sessionStorage),
            }
        ),
        {
            name: "global-search",
        },
    ),
)