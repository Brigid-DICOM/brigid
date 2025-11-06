"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, DownloadIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { DicomStudyCard } from "@/components/dicom/dicom-study-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { getDicomStudyQuery } from "@/react-query/queries/dicomStudy";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";

interface DicomInstancesContentProps {
    workspaceId: string;
}

export default function DicomInstancesContent({
    workspaceId,
}: DicomInstancesContentProps) {
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

    const handleDownloadSelected = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        try {
            if (selectedIds.length === 1) {
                await downloadStudy(workspaceId, selectedIds[0]);
            } else {
                await downloadMultipleStudies(workspaceId, selectedIds);
            }
        } catch (error) {
            console.error("Failed to download selected studies", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected studies");
        }
    }

    if (error) {
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load DICOM instances data
                </h2>
                <p className="text-gray-600">
                    Failed to load DICOM instances data
                </p>
            </div>
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    DICOM Instances
                </h1>
                <p className="text-gray-600">
                    View and manage DICOM studies in your workspace
                </p>
            </div>

            {/* 選取控制列 */}
            {!isLoading && studies && studies.length > 0 && (
                <div className="flex items-center mb-6 p-4 bg-muted rounded-lg gap-6">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant={"outline"}
                            size="sm"
                            onClick={handleSelectAll}
                        >
                            {isAllSelected ? "取消全選" : "全選"}
                        </Button>

                        {selectedCount > 0 && (
                            <Button
                                variant={"outline"}
                                size="sm"
                                onClick={clearSelection}
                            >
                                清除選取
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {selectedCount > 0 && (
                            <span className="text-sm text-gray-600">
                                已選取 {selectedCount} 筆
                            </span>
                        )}

                        {selectedCount > 0 && (
                            <div className="flex items-center space-x-2">
                                <Button 
                                    onClick={handleDownloadSelected}
                                    size="sm"
                                    className="flex items-center"
                                >
                                    <DownloadIcon className="size-4" />
                                    <span>
                                        Download Selected Items ({selectedCount})
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                    {Array.from({ length: ITEM_PER_PAGE }).map((_, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: 沒有合適的 key
                        <div key={index} className="w-full max-w-sm">
                            <Skeleton className="aspect-square w-full mb-4" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : studies && studies.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                        {studies.map((study, index) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: 使用 study instance uid 會出現 type error，所以直接使用 index
                            <DicomStudyCard key={index} study={study} workspaceId={workspaceId} />
                        ))}
                    </div>

                    <div className="flex items-between items-center justify-center space-x-4">
                        <Button
                            variant={"outline"}
                            onClick={handlePreviousPage}
                            disabled={!canGoPrevious}
                            className="flex items-center space-x-2"
                        >
                            <ChevronLeft className="size-4" />
                            <span>Previous</span>
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={handleNextPage}
                            disabled={!canGoNext}
                            className="flex items-center space-x-2"
                        >
                            <span>Next</span>
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
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
