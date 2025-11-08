"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
    Dialog,
    DialogContent,
    DialogDescription, 
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { DicomSearchConditionItem } from "./dicom-search-condition-item";
import { SearchFieldDropdownMenu } from "./search-field-dropdown-menu";

export type SearchLevel = "study" | "series" | "instance";

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
};

const createDefaultConditions = (level: SearchLevel) => {
    return DEFAULT_FIELDS[level].map((field) => ({
        id: field,
        field: field,
        value: "",
    }));
}

export function DicomSearchModal({
    open,
    onOpenChange,
    level,
    onSearch,
}: SearchModalProps) {
    const [conditions, setConditions] = useState<SearchCondition[]>(createDefaultConditions(level));

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        Search {level === "study" ? "Study" : level === "series" ? "Series" : "Instance"}
                    </DialogTitle>
                    <DialogDescription>
                        Enter search criteria for {level === "study" ? "studies" : level === "series" ? "series" : "instances"}.
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
                    <SearchFieldDropdownMenu 
                        level={level}
                        onSelect={addCondition}
                        existingFields={conditions.map(condition => condition.field)}
                    />

                    <div className="flex gap-2">
                        <Button
                            variant={"outline"}
                            onClick={() => onOpenChange(false)}
                        >
                            取消
                        </Button>
                        <Button
                            variant={"default"}
                            onClick={() => {
                                handleSearch();
                                onOpenChange(false);
                            }}
                        >
                            搜尋
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

