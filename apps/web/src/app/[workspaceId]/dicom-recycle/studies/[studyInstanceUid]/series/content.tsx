"use client";

import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomSeriesData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { nanoid } from "zod";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomSeriesCard } from "@/components/dicom/dicom-series-card";
import { DicomRecycleSelectionControlBar } from "@/components/dicom/recycle/dicom-recycle-selection-control-bar";
import { Button } from "@/components/ui/button";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { useUrlSearchParams } from "@/hooks/use-url-search-params";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    deleteDicomSeriesMutation,
    getDicomSeriesQuery,
    restoreDicomSeriesMutation,
} from "@/react-query/queries/dicomSeries";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomRecycleSeriesDataTable } from "./data-table";

interface DicomRecycleSeriesContentProps {
    workspaceId: string;
    studyInstanceUid: string;
}

export default function DicomRecycleSeriesContent({
    workspaceId,
    studyInstanceUid,
}: DicomRecycleSeriesContentProps) {
    const ITEM_PER_PAGE = 10;
    const queryClient = getQueryClient();

    const { setSearchConditionsForType, setSearchType } =
        useGlobalSearchStore();
    const { searchConditions } = useGlobalSearchStore(
        useShallow((state) => ({
            searchConditions:
                state.searchConditionsByType["dicom-recycle-series"] || {},
        })),
    );

    const { layoutMode } = useLayoutStore(
        useShallow((state) => ({
            layoutMode: state.layoutMode,
        })),
    );

    const {
        selectedSeriesIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedSeriesIds,
    } = useDicomSeriesSelectionStore();

    const {
        currentPage,
        handlePreviousPage,
        handleNextPage,
        handleResetToFirstPage,
        canGoPrevious,
    } = usePagination();

    const handleSearchParamsChange = useCallback(
        (urlParams: Record<string, string>) => {
            setSearchConditionsForType("dicom-recycle-series", urlParams);
            setSearchType("dicom-recycle-series");
        },
        [setSearchConditionsForType, setSearchType],
    );

    const { syncSearchParamsToUrl } = useUrlSearchParams({
        searchLevel: "recycle-series",
        onSearchParamsChange: handleSearchParamsChange,
    });

    useEffect(() => {
        if (Object.keys(searchConditions).length > 0) {
            syncSearchParamsToUrl(searchConditions);
        }
    }, [searchConditions, syncSearchParamsToUrl]);

    useEffect(() => {
        return () => clearSelection();
    }, [clearSelection]);

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
            deleteStatus: DICOM_DELETE_STATUS.RECYCLED,
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
    const isAllSelected = useMemo(() => 
        currentPageSeriesUids.length > 0 &&
        currentPageSeriesUids.every((seriesId) =>
            selectedSeriesIds.has(seriesId as string),
        ),
        [currentPageSeriesUids, selectedSeriesIds]
    );

    const { mutate: restoreSeries } = useMutation({
        ...restoreDicomSeriesMutation({
            workspaceId: workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Restoring DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series restored successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to restore DICOM series");
            toast.dismiss(context.meta?.toastId as string);
        },
    });

    const { mutate: deleteSeries } = useMutation({
        ...deleteDicomSeriesMutation({
            workspaceId: workspaceId,
            seriesIds: selectedIds,
        }),
        meta: {
            toastId: nanoid(),
        },
        onMutate: (_, context) => {
            toast.loading("Deleting DICOM series...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM series deleted successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-series", workspaceId, studyInstanceUid],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to delete DICOM series");
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
            queryKey: [
                "dicom-series",
                workspaceId,
                studyInstanceUid,
                0,
                ITEM_PER_PAGE,
            ],
        });
    }, [searchConditions]);

    const handleSelectAll = useCallback(() => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageSeriesUids);
        }
    }, [isAllSelected, clearSelection, selectAll, currentPageSeriesUids]);

    const handleRestore = useCallback(() => {
        if (selectedCount === 0) return;

        restoreSeries();
    }, [selectedCount, restoreSeries]);

    const handleDelete = useCallback(() => {
        if (selectedCount === 0) return;

        deleteSeries();
    }, [selectedCount, deleteSeries]);

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
                    <Link href={`/${workspaceId}/dicom-recycle/studies`}>
                        <Button 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => {
                                setSearchConditionsForType("dicom-recycle-series", {});
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
                <DicomRecycleSelectionControlBar
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onRestore={handleRestore}
                    onDelete={handleDelete}
                    multiRestoreLabel="Restore Selected Series"
                    multiDeleteLabel="Delete Selected Series"
                    dicomLevel="series"
                />
            )}

            {isLoading ? (
                layoutMode === "grid" ? (
                    <LoadingGrid itemCount={ITEM_PER_PAGE} />
                ) : (
                    <LoadingDataTable columns={7} rows={ITEM_PER_PAGE} />
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
                                    type="recycle"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <DicomRecycleSeriesDataTable
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
