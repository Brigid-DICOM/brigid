"use client";

import { useEffect, useState } from "react";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription, 
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { type SearchType, useGlobalSearchStore } from "@/stores/global-search-store";
import { DicomSearchConditionItem } from "./dicom-search-condition-item";
import { SearchFieldDropdownMenu } from "./search-field-dropdown-menu";
import { SEARCH_FIELD_CONFIGS } from "./search-field-types";

export type SearchLevel = "study" | "series" | "instance" | "recycle-study" | "recycle-series" | "recycle-instance";

interface SearchCondition {
    id: string;
    field: string;
    value: string;
}

interface SearchModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    level: SearchLevel;
    onSearch: (conditions: SearchCondition[]) => void;
}

const DEFAULT_FIELDS: Record<SearchLevel, string[]> = {
    study: ["PatientID", "AccessionNumber"],
    series: ["Modality"],
    instance: ["ContentDate"],
    "recycle-study": ["PatientID", "AccessionNumber"],
    "recycle-series": ["Modality"],
    "recycle-instance": ["ContentDate"],
};

const SEARCH_TYPE_MAPPING: Record<SearchLevel, SearchType> = {
    study: "dicom-study",
    series: "dicom-series",
    instance: "dicom-instance",
    "recycle-study": "dicom-recycle-study",
    "recycle-series": "dicom-recycle-series",
    "recycle-instance": "dicom-recycle-instance",
};

const createDefaultConditions = (level: SearchLevel) => {
    return DEFAULT_FIELDS[level].map((field) => ({
        id: field,
        field: field,
        value: "",
    }));
}

const getSupportedFieldsForLevel = (level: SearchLevel): Set<string> => {
    const configs = SEARCH_FIELD_CONFIGS[level];
    return new Set(configs.map(config => config.key));
}

const convertSearchParamsToConditions = (searchParams: Record<string, string>, level: SearchLevel) => {
    const supportedFields = getSupportedFieldsForLevel(level);

    return Object.entries(searchParams)
        .filter(([field, value]) => value?.trim() && supportedFields.has(field))
        .map(([field, value], index) => ({
            id: `${field}-${index}`,
            field,
            value
        }));
}

export function DicomSearchModal({
    open,
    onOpenChange,
    level,
    onSearch,
}: SearchModalProps) {
    const { t } = useT("translation");
    const { getSearchConditionsForType } = useGlobalSearchStore();
    const [conditions, setConditions] = useState<SearchCondition[]>(createDefaultConditions(level));

    const initializeConditions = (currentLevel: SearchLevel) => {
        const searchType = SEARCH_TYPE_MAPPING[currentLevel];
        const existingConditions = getSearchConditionsForType(searchType);
    
        const convertedConditions = convertSearchParamsToConditions(existingConditions, currentLevel);

        if (convertedConditions.length > 0) {
            setConditions(convertedConditions);
        } else {
            setConditions(createDefaultConditions(currentLevel));
        }
    }
    
    // biome-ignore lint/correctness/useExhaustiveDependencies: 只在 level 變化時初始化
    useEffect(() => {
        initializeConditions(level);
    }, [level]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: 當 modal 打開時，重新載入新的搜尋條件
    useEffect(() => {
        if (open) {
            initializeConditions(level);
        }
    }, [open, level]);

    useEffect(() => {
        setConditions(createDefaultConditions(level));
    }, [level]);

    const addCondition = (key: string) => {
        setConditions(prev => [
            ...prev,
            {
                id: key,
                field: key,
                value: "",
            }
        ]);
    };

    const removeCondition = (id: string) => {
        setConditions(prev => prev.filter(condition => condition.id !== id));
    };

    const updateCondition = (id: string, field: string, value: string) => {
        setConditions(prev => prev.map(condition => condition.id === id ? { ...condition, field, value } : condition));
    }

    const handleSearch = () => {
        const validConditions = conditions.filter(condition => condition.value.trim() !== "");
        onSearch(validConditions);
    }

    const handleClearAll = () => {
        setConditions(createDefaultConditions(level));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t("dicom.search.title")} {level === "study" ? "Study" : level === "series" ? "Series" : "Instance"}
                    </DialogTitle>
                    <DialogDescription>
                        {t("dicom.search.description", { level: level === "study" ? "studies" : level === "series" ? "series" : "instances" })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-3">
                        {conditions.map((condition) => (
                            <DicomSearchConditionItem 
                                key={condition.id}
                                condition={condition}
                                level={level}
                                canRemove={conditions.length > 1}
                                onUpdate={updateCondition}
                                onRemove={removeCondition}
                            />
                        ))}
                    </div>
                </div>

                <DialogFooter className="flex sm:justify-between">
                    <div className="flex gap-2">
                        <SearchFieldDropdownMenu 
                            level={level}
                            onSelect={addCondition}
                            existingFields={conditions.map(condition => condition.field)}
                        />

                        {conditions.some(c => c.value.trim()) && (
                            <Button
                                variant={"ghost"}
                                size={"sm"}
                                onClick={handleClearAll}
                                className="text-xs"
                            >
                                {t("search.clearAll")}
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={"outline"}
                            onClick={() => onOpenChange(false)}
                        >
                            {t("dicom.search.cancel")}
                        </Button>
                        <Button
                            variant={"default"}
                            onClick={() => {
                                handleSearch();
                                onOpenChange(false);
                            }}
                        >
                            {t("dicom.search.search")}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

