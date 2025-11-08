"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
    onSearch: () => void;
}

export function DicomSearchButton({ onSearch }: SearchButtonProps) {
    return (
        <Button
            variant={"outline"}
            onClick={onSearch}
            className="flex items-center space-x-2"
        >
            <SearchIcon className="size-4" />
            <span>Search</span>
        </Button>
    )
}