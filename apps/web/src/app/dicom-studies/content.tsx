"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomStudyCard } from "@/components/dicom/dicom-study-card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { getDicomStudyQuery } from "@/react-query/queries/dicomStudy";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";

interface DicomStudiesContentProps {
    workspaceId: string;
}

export default function DicomStudiesContent({
    workspaceId,
}: DicomStudiesContentProps) {
    const ITEM_PER_PAGE = 10;

    const {
        selectedStudyIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedStudyIds,
    } = useDicomStudySelectionStore();
    
    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } = usePagination();

    const {
        data: studies,
        isLoading,
        error,
    } = useQuery(
        getDicomStudyQuery({
            workspaceId: workspaceId,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
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
        enabled: selectedCount > 0,
    });

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
                <LoadingGrid 
                    itemCount={ITEM_PER_PAGE}
                />
            ) : studies && studies.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                        {studies.map((study, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: 使用 study instance uid 會出現 type error，所以直接使用 index
                            <DicomStudyCard key={index} study={study} workspaceId={workspaceId} />
                        ))}
                    </div>

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
        </div>
    );
}
