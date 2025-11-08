"use client";

import type { DicomStudyData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomStudyCard } from "@/components/dicom/dicom-study-card";
import { DicomSearchButton } from "@/components/dicom/search/dicom-search-button";
import type { SearchCondition } from "@/components/dicom/search/dicom-search-condition-item";
import { DicomSearchModal } from "@/components/dicom/search/dicom-search-modal";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomStudyQuery } from "@/react-query/queries/dicomStudy";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomStudiesDataTable } from "./data-table";

interface DicomStudiesContentProps {
    workspaceId: string;
}

export default function DicomStudiesContent({
    workspaceId,
}: DicomStudiesContentProps) {
    const ITEM_PER_PAGE = 10;
    const queryClient = getQueryClient();
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [searchConditions, setSearchConditions] = useState<Record<string, string>>({});

    const { layoutMode } = useLayoutStore();

    const {
        selectedStudyIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedStudyIds,
    } = useDicomStudySelectionStore();
    
    const { currentPage, handlePreviousPage, handleNextPage, handleResetToFirstPage, canGoPrevious } = usePagination();

    const {
        data: studies,
        isLoading,
        error,
    } = useQuery(
        getDicomStudyQuery({
            workspaceId: workspaceId,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
            ...searchConditions,
        }),
    );

    const canGoNext = studies && studies.length === ITEM_PER_PAGE;

    const currentPageStudyIds = useMemo(() => {
        return studies?.map((study) => study["0020000D"]?.Value?.[0] as string).filter(Boolean) || [];
    }, [studies]);

    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedStudyIds();
    const isAllSelected = currentPageStudyIds.length > 0 &&
    currentPageStudyIds.every((studyId) => selectedStudyIds.has(studyId as string));

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    const handleSearch = (conditions: SearchCondition[]) => {
        const searchParams = conditions.reduce((acc, condition) => {
            acc[condition.field] = condition.value;
            return acc;
        }, {} as Record<string, string>);

        setSearchConditions(searchParams);
        handleResetToFirstPage();

        requestAnimationFrame(() => {
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId, 0, ITEM_PER_PAGE],
            });
        });
    }

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageStudyIds);
        }
    }

    const { handleDownload } = useDownloadHandler({
        downloadSingle: (id: string) => downloadStudy(workspaceId, id),
        downloadMultiple: (ids: string[]) => downloadMultipleStudies(workspaceId, ids),
        errorMessage: "Failed to download selected studies",
    });

    if (error) {
        return (
            <EmptyState 
                title="載入失敗"
                description="無法載入 DICOM Studies 資料"
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">

                <div className="mb-4">
                    <DicomSearchButton 
                        onSearch={() => setSearchModalOpen(true)}
                    />
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                    DICOM Studies
                </h1>
                <p className="text-gray-600">
                    View and manage DICOM studies in your workspace
                </p>
            </div>

            {/* 選取控制列 */}
            {!isLoading && studies && studies.length > 0 && (
                <SelectionControlBar 
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onDownload={() => handleDownload(selectedIds)}
                    multiDownloadLabel="Download Selected Studies"
                />
            )}

            {isLoading ? (
                layoutMode === "grid" ? (
                    <LoadingGrid 
                        itemCount={ITEM_PER_PAGE}
                    />
                ) : (
                    <LoadingDataTable 
                        columns={8}
                        rows={ITEM_PER_PAGE}
                    />
                )
            ) : studies && studies.length > 0 ? (
                <>
                    {layoutMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {studies.map((study, index) => (
                                // biome-ignore lint/suspicious/noArrayIndexKey: 使用 study instance uid 會出現 type error，所以直接使用 index
                                <DicomStudyCard key={index} study={study as DicomStudyData} workspaceId={workspaceId} />
                            ))}
                        </div>
                    ): (
                        <div className="mb-8">
                            <DicomStudiesDataTable 
                                studies={studies as DicomStudyData[]}
                                workspaceId={workspaceId}
                            />
                        </div>
                    )}

                    <PaginationControls 
                        canGoPrevious={canGoPrevious}
                        canGoNext={Boolean(canGoNext)}
                        onPrevious={handlePreviousPage}
                        onNext={handleNextPage}
                    />
                </>
            ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            No data
                        </h2>
                        <p className="text-gray-600">No data to display</p>
                    </div>
                </div>
            )}

            <DicomSearchModal 
                open={searchModalOpen}
                onOpenChange={setSearchModalOpen}
                level="study"
                onSearch={handleSearch}
            />
        </div>
    );
}
