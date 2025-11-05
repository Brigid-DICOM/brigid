"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DicomSeriesCard } from "@/components/dicom/dicom-series.card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
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
    const [currentPage, setCurrentPage] = useState(0);
    const ITEM_PER_PAGE = 10;

    const {
        selectedSeriesIds,
        clearSelection,
        selectAll,
        getSelectedCount,
    } = useDicomSeriesSelectionStore();

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

    const currentPageSeriesUids = useMemo(() => {
        return (
            series
                ?.map((s) => s["0020000E"]?.Value?.[0] as string)
                .filter(Boolean) || []
        );
    }, [series]);
    const selectedCount = getSelectedCount();
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

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const canGoPrevious = currentPage > 0;
    const canGoNext = series && series.length === ITEM_PER_PAGE;

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
                                已選取 {selectedCount} 筆 Series
                            </span>
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
