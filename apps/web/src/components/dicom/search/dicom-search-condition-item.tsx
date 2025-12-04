"use client";

import { useQuery } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { MultiSelect, type Option } from "@/components/ui/multi-select";
import { apiClient } from "@/react-query/apiClient";
import { useWorkspaceStore } from "@/stores/workspace-store";
import type { SearchLevel } from "./dicom-search-modal";
import { SEARCH_FIELD_CONFIGS } from "./search-field-types";

export interface SearchCondition {
    id: string;
    field: string;
    value: string;
}

interface DicomSearchConditionItemProps {
    condition: SearchCondition;
    level: SearchLevel;
    canRemove: boolean;
    onUpdate: (id: string, field: string, value: string) => void;
    onRemove: (id: string) => void;
}

export function DicomSearchConditionItem({
    condition,
    level,
    canRemove,
    onUpdate,
    onRemove,
}: DicomSearchConditionItemProps) {
    const workspaceId = useWorkspaceStore(useShallow((state) => state.workspace?.id));

    const fieldConfig = SEARCH_FIELD_CONFIGS[level].find(
        (config) => config.key === condition.field,
    );

    const { data: tags } = useQuery({
        queryKey: ["tags", workspaceId, level],
        queryFn: async () => {
            if (!workspaceId) return [];

            const targetTypeMap: Record<string, "study" | "series" | "instance"> = {
                study: "study",
                series: "series",
                instance: "instance",
                "recycle-study": "study",
                "recycle-series": "series",
                "recycle-instance": "instance"
            };
            
            const res = await apiClient.api.workspaces[":workspaceId"].tags.$get({
                param: { workspaceId },
                query: { 
                    targetType: targetTypeMap[level] 
                }
            });

            if (!res.ok) {
                throw new Error("Failed to fetch tags");
            }

            return (await res.json()).data;
        },
        enabled: !!workspaceId && condition.field === "tagName",
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const renderValueInput = () => {
        if (!fieldConfig) {
            return (
                <Input
                    placeholder="Enter value"
                    value={condition.value}
                    onChange={(e) =>
                        onUpdate(condition.id, condition.field, e.target.value)
                    }
                    className="flex-1"
                />
            );
        }

        switch (fieldConfig.type) {
            case "text":
                return (
                    <Input
                        placeholder={
                            fieldConfig.placeholder ||
                            `Enter ${fieldConfig.label}`
                        }
                        value={condition.value}
                        onChange={(e) =>
                            onUpdate(
                                condition.id,
                                condition.field,
                                e.target.value,
                            )
                        }
                        className="flex-1"
                    />
                );

            case "dateRange":
                return (
                    <div className="flex-1">
                        <DateRangePicker
                            value={condition.value}
                            onChange={(value) =>
                                onUpdate(condition.id, condition.field, value)
                            }
                        />
                    </div>
                );
            case "select": {
                const selectedValues = condition.value 
                    ? condition.value.split(",").filter(value => value.trim() !== "")
                    : [];

                let options: Option[] = fieldConfig.options?.map((opt) => ({
                    label: opt.label,
                    value: opt.value,
                })) || [];

                if (condition.field === "tagName") {
                    options = tags?.map((tag) => ({
                        label: tag.name,
                        value: tag.name,
                    })) || [];
                }

                return (
                    <MultiSelect 
                        options={options}
                        selected={selectedValues}
                        onChange={(selected) => {
                            const value = selected.join(",");
                            onUpdate(condition.id, condition.field, value);
                        }}
                        placeholder={`Select ${fieldConfig.label}`}
                        className="flex-1"
                    />
                );
            }
                
            default:
                return (
                    <Input
                        placeholder="輸入搜尋值"
                        value={condition.value}
                        onChange={(e) =>
                            onUpdate(
                                condition.id,
                                condition.field,
                                e.target.value,
                            )
                        }
                        className="flex-1"
                    />
                );
        }
    };

    return (
        <div className="flex flex-col items-start gap-2 rounded-md border p-2">
            <div className="flex items-center justify-between w-full">
                <p className="text-sm font-semibold">
                    {fieldConfig?.label}
                </p>
                {canRemove && (
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        onClick={() => onRemove(condition.id)}
                        className="px-2 my-auto"
                    >
                        <XIcon className="size-3" />
                    </Button>
                )}
            </div>

            <div className="flex flex-1 items-center gap-2 w-full">
                <div className="flex-1">{renderValueInput()}</div>
            </div>

        </div>
    );
}
