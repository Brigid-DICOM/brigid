"use client";

import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SearchLevel } from "./dicom-search-modal";
import { SEARCH_FIELD_CONFIGS } from "./search-field-types";

interface SearchFieldDropdownMenuProps {
    level: SearchLevel;
    onSelect: (field: string) => void;
    existingFields: string[];
}

export function SearchFieldDropdownMenu({
    level,
    onSelect,
    existingFields,
}: SearchFieldDropdownMenuProps) {
    const fields = SEARCH_FIELD_CONFIGS[level];

    const handleSelect = (field: string) => {
        if (existingFields.includes(field)) {
            toast.warning("This field is already selected");
            return;
        }

        onSelect(field);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"outline"}
                    className="flex items-center space-x-2"
                >
                    <PlusIcon className="size-4" />
                    <span>Add Field</span>
                    <ChevronDownIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {fields.map((field) => {
                    const isDisabled = existingFields.includes(field.key);
                    return (
                        <DropdownMenuItem
                            key={field.key}
                            onClick={() => handleSelect(field.key)}
                            disabled={isDisabled}
                        >
                            {field.label}
                            {isDisabled && " (Exists)"}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
