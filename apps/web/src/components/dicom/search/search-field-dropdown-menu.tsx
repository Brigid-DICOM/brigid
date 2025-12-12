"use client";

import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
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
    const { t } = useT("translation");
    const fields = SEARCH_FIELD_CONFIGS[level];

    const handleSelect = (field: string) => {
        if (existingFields.includes(field)) {
            toast.warning(t("dicom.search.fieldAlreadySelected"));
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
                    <span>{t("dicom.search.addField")}</span>
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
                            {isDisabled && ` (${t("dicom.search.fieldExists")})`}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
