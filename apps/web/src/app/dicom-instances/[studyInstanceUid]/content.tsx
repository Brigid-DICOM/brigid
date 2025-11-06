"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { DicomSeriesCard } from "@/components/dicom/dicom-series.card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { getDicomSeriesQuery } from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";

interface DicomInstancesSeriesContentProps {
    workspaceId: string;
    studyInstanceUid: string;
}

export default function DicomInstancesSeriesContent({
    workspaceId,
    studyInstanceUid,
}: DicomInstancesSeriesContentProps) {
    const ITEM_PER_PAGE = 10;

    const {
        selectedSeriesIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedSeriesIds
    } = useDicomSeriesSelectionStore();

    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } = usePagination();
    const {
        data: series,
        isLoading,
        error,
    } = useQuery(
        getDicomSeriesQuery({
            workspaceId: workspaceId,
            studyInstanceUid: studyInstanceUid,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        }),
    );
    const canGoNext = series && series.length === ITEM_PER_PAGE;

    const currentPageSeriesUids = useMemo(() => {
        return (
            series
                ?.map((s) => s["0020000E"]?.Value?.[0] as string)
                .filter(Boolean) || []
        );
    }, [series]);
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedSeriesIds();
    const isAllSelected =
        currentPageSeriesUids.length > 0 &&
        currentPageSeriesUids.every((seriesId) =>
            selectedSeriesIds.has(seriesId as string),
        );

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0,
    });

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageSeriesUids);
        }
    };

    const handleDownloadSelected = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        try {
            if (selectedIds.length === 1) {
                await downloadSeries(workspaceId, studyInstanceUid, selectedIds[0]);
            } else {
                await downloadMultipleSeries(workspaceId, studyInstanceUid, selectedIds);
            }
        } catch(error) {
            console.error("Failed to download selected series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected series");
        }
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        載入失敗
                    </h2>
                    <p className="text-gray-600">無法載入 DICOM series 資料</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8 flex items-center space-x-4">
                <Link href="/dicom-instances">
                    <Button
                        variant="outline"
                        className="flex items-center"
                    >
                        <ArrowLeftIcon className="size-4" />
                    </Button>
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        DICOM Series
                    </h1>
                    <p className="text-gray-600">
                        Study Instance UID: {studyInstanceUid}
                    </p>
                </div>
            </div>

            {!isLoading && series && series.length > 0 && (
                <SelectionControlBar 
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onDownload={handleDownloadSelected}
                    multiDownloadLabel="Download Selected Series"
                />
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
            ) : series && series.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                        {series.map((seriesItem, index) => (
                            <DicomSeriesCard
                                // biome-ignore lint/suspicious/noArrayIndexKey: 使用 series instance uid 會出現 type error，所以直接使用 index
                                key={index}
                                series={seriesItem}
                                workspaceId={workspaceId}
                                studyInstanceUid={studyInstanceUid}
                            />
                        ))}
                    </div>

                    <div className="flex items-between items-center justify-center space-x-4">
                        <Button
                            variant={"outline"}
                            onClick={handlePreviousPage}
                            disabled={!canGoPrevious}
                            className="flex items-center space-x-2"
                        >
                            <ChevronLeftIcon className="size-4" />
                            <span>Previous</span>
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={handleNextPage}
                            disabled={!canGoNext}
                            className="flex items-center space-x-2"
                        >
                            <span>Next</span>
                            <ChevronRightIcon className="size-4" />
                        </Button>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">
                            沒有資料
                        </h2>
                        <p className="text-gray-600">目前沒有可顯示的 Series</p>
                    </div>
                </div>
            )}
        </div>
    );
}
