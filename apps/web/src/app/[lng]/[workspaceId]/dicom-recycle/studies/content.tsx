"use client";

import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomStudyData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useT } from "@/app/_i18n/client";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomStudyCard } from "@/components/dicom/dicom-study-card";
import { DicomRecycleSelectionControlBar } from "@/components/dicom/recycle/dicom-recycle-selection-control-bar";
import { useStudyRecycleActions } from "@/hooks/dicom-recycle/use-study-recycle-actions";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { useUrlSearchParams } from "@/hooks/use-url-search-params";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    getDicomStudyQuery,
} from "@/react-query/queries/dicomStudy";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomRecycleStudiesDataTable } from "./data-table";

interface DicomRecycleStudiesContentProps {
    workspaceId: string;
}

export default function DicomRecycleStudiesContent({
    workspaceId,
}: DicomRecycleStudiesContentProps) {
    const { t } = useT("translation");
    const isFirstRun = useRef(true);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const ITEM_PER_PAGE = 10;
    const queryClient = getQueryClient();
    const {
        setSearchConditionsForType,
        setSearchType,
        getSearchConditionsForType,
    } = useGlobalSearchStore();
    const searchConditions = mounted
        ? getSearchConditionsForType("dicom-recycle-study")
        : {};

    const { layoutMode } = useLayoutStore(
        useShallow((state) => ({
            layoutMode: state.layoutMode,
        })),
    );

    const {
        selectedStudyIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedStudyIds,
    } = useDicomStudySelectionStore();

    const {
        currentPage,
        handlePreviousPage,
        handleNextPage,
        handleResetToFirstPage,
        canGoPrevious,
    } = usePagination();

    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedStudyIds();

    const handleSearchParamsChange = useCallback(
        (urlParams: Record<string, string>) => {
            setSearchConditionsForType("dicom-recycle-study", urlParams);
            setSearchType("dicom-recycle-study");
        },
        [setSearchConditionsForType, setSearchType],
    );

    const { syncSearchParamsToUrl } = useUrlSearchParams({
        searchLevel: "recycle-study",
        onSearchParamsChange: handleSearchParamsChange,
    });

    useEffect(() => {
        if (!mounted || isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        syncSearchParamsToUrl(searchConditions);
    }, [searchConditions, syncSearchParamsToUrl, mounted]);

    useEffect(() => {
        return () => clearSelection();
    }, [clearSelection]);

    const {
        data: studies,
        isLoading,
        error,
    } = useQuery(
        getDicomStudyQuery({
            workspaceId,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            instanceDeleteStatus: DICOM_DELETE_STATUS.RECYCLED,
            ...searchConditions,
        }),
    );

    const canGoNext = studies && studies.length === ITEM_PER_PAGE;

    const currentPageStudyIds = useMemo(() => {
        return (
            studies
                ?.map((study) => study["0020000D"]?.Value?.[0] as string)
                .filter(Boolean) || []
        );
    }, [studies]);
    const isAllSelected = useMemo(
        () =>
            currentPageStudyIds.length > 0 &&
            currentPageStudyIds.every((studyId) =>
                selectedStudyIds.has(studyId as string),
            ),
        [currentPageStudyIds, selectedStudyIds],
    );

    const { restoreStudies, deleteStudies, setStudyIds: setRecycleStudyIds } = useStudyRecycleActions({
        workspaceId,
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
                "dicom-study",
                workspaceId,
                0,
                ITEM_PER_PAGE,
                DICOM_DELETE_STATUS.RECYCLED,
                ...Object.keys(searchConditions),
            ],
        });
    }, [searchConditions]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageStudyIds);
        }
    };

    const handleRestore = () => {
        if (selectedCount === 0) return;
        setRecycleStudyIds(selectedIds);
        restoreStudies();
    };

    const handleDelete = () => {
        if (selectedCount === 0) return;
        setRecycleStudyIds(selectedIds);
        deleteStudies();
    };

    if (error) {
        return (
            <EmptyState
                title={t("common.loadFailed")}
                description={t("dicom.messages.loadRecycleFailed", { level: "studies" })}
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    DICOM Recycle Studies
                </h1>
                <p className="text-gray-600">
                    View and manage DICOM studies in your recycle bin
                </p>
            </div>

            {!isLoading && studies && studies.length > 0 && (
                <>
                    {/* 回收桶控制列 */}
                    <DicomRecycleSelectionControlBar
                        selectedCount={selectedCount}
                        isAllSelected={isAllSelected}
                        onSelectAll={handleSelectAll}
                        onClearSelection={clearSelection}
                        onRestore={handleRestore}
                        onDelete={handleDelete}
                        dicomLevel="study"
                    />
                </>
            )}

            {isLoading ? (
                layoutMode === "grid" ? (
                    <LoadingGrid itemCount={ITEM_PER_PAGE} />
                ) : (
                    <LoadingDataTable columns={8} rows={ITEM_PER_PAGE} />
                )
            ) : studies && studies.length > 0 ? (
                <>
                    {layoutMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {studies.map((study, index) => (
                                <DicomStudyCard
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 使用 study instance uid 會出現 type error，所以直接使用 index
                                    key={index}
                                    study={study as DicomStudyData}
                                    workspaceId={workspaceId}
                                    type="recycle"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <DicomRecycleStudiesDataTable
                                studies={studies as unknown as DicomStudyData[]}
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
                    <EmptyState
                        title={t("dicom.messages.noData", { level: "studies" })}
                        description={t("dicom.messages.noDataToDisplay", { level: "studies" })}
                    />
                </div>
            )}
        </div>
    );
}
