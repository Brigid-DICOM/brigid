"use client";

import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomSeriesData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { nanoid } from "zod";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomSeriesCard } from "@/components/dicom/dicom-series-card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { Button } from "@/components/ui/button";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { useUrlSearchParams } from "@/hooks/use-url-search-params";
import { downloadMultipleSeries, downloadSeries } from "@/lib/clientDownload";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomSeriesQuery, recycleDicomSeriesMutation } from "@/react-query/queries/dicomSeries";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomSeriesDataTable } from "./data-table";

interface DicomSeriesContentProps {
    workspaceId: string;
    studyInstanceUid: string;
}

export default function DicomSeriesContent({
    workspaceId,
    studyInstanceUid,
}: DicomSeriesContentProps) {
    const isFirstRun = useRef(true);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const ITEM_PER_PAGE = 10;
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();

    const { 
        getSearchConditionsForType,
        setSearchConditionsForType,
        setSearchType
    } = useGlobalSearchStore();
    const searchConditions = mounted ? getSearchConditionsForType("dicom-series") : {};

    const { layoutMode } = useLayoutStore();
    const { close: closeBlueLightViewer, open: openBlueLightViewer } = useBlueLightViewerStore();

    const {
        selectedSeriesIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedSeriesIds
    } = useDicomSeriesSelectionStore();

    useEffect(() => {
        const openStudyInstanceUid = searchParams.get("openStudyInstanceUid");
        const openSeriesInstanceUid = searchParams.get("openSeriesInstanceUid");
        if (openStudyInstanceUid) {
            openBlueLightViewer({
                studyInstanceUid: openStudyInstanceUid,
                seriesInstanceUid: openSeriesInstanceUid || undefined,
            });
        }
    }, [searchParams, openBlueLightViewer]);

    const { currentPage, handlePreviousPage, handleNextPage, handleResetToFirstPage, canGoPrevious } = usePagination();

    const handleSearchParamsChange = useCallback((urlParams: Record<string, string>) => {
        setSearchConditionsForType("dicom-series", urlParams);
        setSearchType("dicom-series");
    }, [setSearchConditionsForType, setSearchType]);

    const  { syncSearchParamsToUrl } = useUrlSearchParams({
        searchLevel: "series",
        onSearchParamsChange: handleSearchParamsChange
    });

    useEffect(() => {
        if (!mounted || isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        syncSearchParamsToUrl(searchConditions);
    }, [searchConditions, syncSearchParamsToUrl, mounted]);

    useEffect(() => {
        return () => {
            clearSelection();
            closeBlueLightViewer();
        };
    }, [clearSelection, closeBlueLightViewer]);

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
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            ...searchConditions,
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

    const { mutate: recycleDicomSeries } = useMutation({
        ...recycleDicomSeriesMutation({
            workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid()
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: 當 searchConditions 改變時，需要重置分頁到第一頁並重新查詢
    useEffect(() => {
        handleResetToFirstPage();
        queryClient.invalidateQueries({
            queryKey: ["dicom-series", workspaceId, studyInstanceUid, 0, ITEM_PER_PAGE],
        });
    }, [searchConditions]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageSeriesUids);
        }
    };

    const { handleDownload } = useDownloadHandler({
        downloadSingle: (id: string) => downloadSeries(workspaceId, studyInstanceUid, id),
        downloadMultiple: (ids: string[]) => downloadMultipleSeries(workspaceId, studyInstanceUid, ids),
        errorMessage: "Failed to download selected series",
    });

    if (error) {
        return (
            <EmptyState 
                title="載入失敗"
                description="無法載入 DICOM series 資料"
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <div className="mb-8 flex flex-col items-start space-x-4">
                <div className="flex flex-1 items-center space-x-4">
                    <Link href={`/${workspaceId}/dicom-studies`}>
                        <Button
                            variant="outline"
                            className="flex items-center"
                            onClick={() => {
                                setSearchConditionsForType("dicom-series", {});
                            }}
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

            </div>

            {!isLoading && series && series.length > 0 && (
                <SelectionControlBar 
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onDownload={() => handleDownload(selectedIds)}
                    onRecycle={() => recycleDicomSeries()}
                    multiRecycleLabel="Recycle Selected Series"
                    multiDownloadLabel="Download Selected Series"
                    dicomLevel="series"
                />
            )}

            {isLoading ? (
                layoutMode === "grid" ? (
                    <LoadingGrid 
                        itemCount={ITEM_PER_PAGE} 
                    />
                ) : (
                    <LoadingDataTable 
                        columns={7}
                        rows={ITEM_PER_PAGE}
                    />
                )
            ) : series && series.length > 0 ? (
                <>
                    {layoutMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {series.map((seriesItem, index) => (
                                <DicomSeriesCard
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 使用 series instance uid 會出現 type error，所以直接使用 index
                                    key={index}
                                    series={seriesItem as DicomSeriesData}
                                    workspaceId={workspaceId}
                                    studyInstanceUid={studyInstanceUid}
                                    type="management"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <DicomSeriesDataTable 
                                series={series as DicomSeriesData[]}
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
                            沒有資料
                        </h2>
                        <p className="text-gray-600">目前沒有可顯示的 Series</p>
                    </div>
                </div>
            )}
        </div>
    );
}
