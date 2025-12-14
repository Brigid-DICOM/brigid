"use client";

import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomStudyData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomRecycleConfirmDialogProvider } from "@/components/dicom/dicom-recycle-confirm-dialog-provider";
import { DicomStudyCard } from "@/components/dicom/dicom-study-card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { ShareManagementDialogProvider } from "@/components/share/share-management-dialog-provider";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { useUrlSearchParams } from "@/hooks/use-url-search-params";
import { downloadMultipleStudies, downloadStudy } from "@/lib/clientDownload";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomStudyQuery, recycleDicomStudyMutation } from "@/react-query/queries/dicomStudy";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomStudiesDataTable } from "./data-table";

interface DicomStudiesContentProps {
    workspaceId: string;
}

export default function DicomStudiesContent({
    workspaceId,
}: DicomStudiesContentProps) {
    const isFirstRun = useRef(true);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const ITEM_PER_PAGE = 10;
    const queryClient = getQueryClient();
    const searchParams = useSearchParams();
    const { getSearchConditionsForType, setSearchConditionsForType, setSearchType } = useGlobalSearchStore();
    const searchConditions = mounted ? getSearchConditionsForType("dicom-study") : {};

    const { layoutMode } = useLayoutStore();
    const { close: closeBlueLightViewer, open: openBlueLightViewer } = useBlueLightViewerStore();

    const {
        selectedStudyIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedStudyIds,
    } = useDicomStudySelectionStore();

    useEffect(() => {
        const openStudyInstanceUid = searchParams.get("openStudyInstanceUid");
        if (openStudyInstanceUid) {
            openBlueLightViewer({
                studyInstanceUid: openStudyInstanceUid,
            });
        }
    }, [searchParams, openBlueLightViewer]);
    
    const { currentPage, handlePreviousPage, handleNextPage, handleResetToFirstPage, canGoPrevious } = usePagination();
    
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedStudyIds();
    
    const handleSearchParamsChange = useCallback((urlParams: Record<string, string>) => {
        setSearchConditionsForType("dicom-study", urlParams);
        setSearchType("dicom-study");
    }, [setSearchConditionsForType, setSearchType]);

    const { syncSearchParamsToUrl } = useUrlSearchParams({
        searchLevel: "study",
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
        data: studies,
        isLoading,
        error,
    } = useQuery(
        getDicomStudyQuery({
            workspaceId: workspaceId,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            ...searchConditions,
        }),
    );
    const canGoNext = studies && studies.length === ITEM_PER_PAGE;
    
    const currentPageStudyIds = useMemo(() => {
        return studies?.map((study) => study["0020000D"]?.Value?.[0] as string).filter(Boolean) || [];
    }, [studies]);
    const isAllSelected = currentPageStudyIds.length > 0 &&
    currentPageStudyIds.every((studyId) => selectedStudyIds.has(studyId as string));
    
    const { mutate: recycleStudies } = useMutation({
        ...recycleDicomStudyMutation({
            workspaceId,
            studyIds: selectedIds
        }),
        meta: {
            toastId: nanoid()
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM studies...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM studies recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            queryClient.invalidateQueries({
                queryKey: ["dicom-study", workspaceId],
            });
            clearSelection();
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM studies");
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
        }
    });

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: 當 searchConditions 改變時，需要重置分頁到第一頁並重新查詢
    useEffect(() => {
        handleResetToFirstPage();
        queryClient.invalidateQueries({
            queryKey: ["dicom-study", workspaceId, 0, ITEM_PER_PAGE],
        });
    }, [searchConditions]);

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

    const handleRecycle = () => {
        if (selectedCount === 0) return;

        recycleStudies();
    };

    if (error) {
        return (
            <EmptyState 
                title="載入失敗"
                description="無法載入 DICOM Studies 資料"
            />
        );
    }

    return (
        <>

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
                        onRecycle={handleRecycle}
                        dicomLevel="study"
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
                                    <DicomStudyCard key={index} study={study as DicomStudyData} workspaceId={workspaceId} type="management" />
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
            </div>

            <ShareManagementDialogProvider />
            <DicomRecycleConfirmDialogProvider />
        </>
    );
}
