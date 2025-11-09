"use client";

import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import type { SearchCondition } from "../dicom/search/dicom-search-condition-item";
import { DicomSearchModal } from "../dicom/search/dicom-search-modal";
import { Button } from "../ui/button";
import { getSearchTypeConfig, getSearchTypeFromRoute } from "./search-type-config";

export function GlobalSearch() {
    const pathname = usePathname();
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    
    const {
        searchType,
        setSearchType,
        executeSearch,
    } = useGlobalSearchStore();

    useEffect(() => {
        const autoDetectedType = getSearchTypeFromRoute(pathname);
        if (autoDetectedType && autoDetectedType !== searchType) {
            setSearchType(autoDetectedType);

            if (searchModalOpen) {
                setSearchModalOpen(false);
            }
        }
    }, [pathname, searchType, setSearchType, searchModalOpen]);

    const currentSearchTypeConfig = searchType ? getSearchTypeConfig(searchType) : null;

    const handleSearch = (conditions: SearchCondition[]) => {
        if (searchType) {
            executeSearch(searchType, conditions);
        }
    }

    const handleOpenSearch = () => {
        if (searchType) {
            setSearchModalOpen(true);
        }
    }

    if (!currentSearchTypeConfig) {
        return null;
    }

    return (
        <>
            <div className="flex items-center gap-2">
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={handleOpenSearch}
                    className="flex items-center gap-2"
                >
                    <SearchIcon className="size-4" />
                    <span className="hidden sm:inline">Search {currentSearchTypeConfig.label}</span>
                </Button>
            </div>

            {currentSearchTypeConfig?.dicomLevel && (
                <DicomSearchModal 
                    key={`${currentSearchTypeConfig.dicomLevel}-${pathname}`}
                    open={searchModalOpen}
                    onOpenChange={setSearchModalOpen}
                    level={currentSearchTypeConfig.dicomLevel}
                    onSearch={handleSearch}
                />
            )}
        </>
    )
}