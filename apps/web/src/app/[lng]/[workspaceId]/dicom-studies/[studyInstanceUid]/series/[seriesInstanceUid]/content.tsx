"use client";

import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomInstanceData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomInstanceCard } from "@/components/dicom/dicom-instance-card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { Button } from "@/components/ui/button";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { useUrlSearchParams } from "@/hooks/use-url-search-params";
import {
    downloadInstance,
    downloadInstanceAsJpg,
    downloadInstanceAsPng,
    downloadMultipleInstances,
    downloadMultipleInstancesAsJpg,
    downloadMultipleInstancesAsPng,
} from "@/lib/clientDownload";
import { getQueryClient } from "@/react-query/get-query-client";
import { getDicomInstanceQuery, recycleDicomInstanceMutation } from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useGlobalSearchStore } from "@/stores/global-search-store";
import { useLayoutStore } from "@/stores/layout-store";
import { DicomInstancesDataTable } from "./data-table";

interface DicomInstancesContentProps {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
}

export default function DicomInstancesContent({
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
}: DicomInstancesContentProps) {
    const isFirstRun = useRef(true);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const queryClient = getQueryClient();
    const ITEM_PER_PAGE = 10;
    const { layoutMode } = useLayoutStore();

    const { getSearchConditionsForType, setSearchConditionsForType, setSearchType } = useGlobalSearchStore();
    // 在 Hydration 完成前 (mounted 為 false)，使用空物件以確保與 Server Side 渲染一致
    // Hydration 完成後 (mounted 為 true)，才使用 zustand store 中的狀態
    const searchConditions = mounted ? getSearchConditionsForType("dicom-instance") : {};

    const {
        selectedInstanceIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedInstanceIds,
    } = useDicomInstanceSelectionStore();

    const { currentPage, handlePreviousPage, handleNextPage, handleResetToFirstPage, canGoPrevious } =
        usePagination();

    const handleSearchParamsChange = useCallback((urlParams: Record<string, string>) => {
        setSearchConditionsForType("dicom-instance", urlParams);
        setSearchType("dicom-instance");
    }, [setSearchConditionsForType, setSearchType]);

    const { syncSearchParamsToUrl } = useUrlSearchParams({
        searchLevel: "instance",
        onSearchParamsChange: handleSearchParamsChange
    });

    useEffect(() => {
        // 在初次渲染時，不同步 URL 的 searchParams，避免重複渲染
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
        data: instances,
        isLoading,
        error,
    } = useQuery(
        getDicomInstanceQuery({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
            deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            ...searchConditions,
        }),
    );
    const canGoNext = instances && instances.length === ITEM_PER_PAGE;

    const currentPageInstanceUids = useMemo(() => {
        return (
            instances
                ?.map((instance) => instance["00080018"]?.Value?.[0] as string)
                .filter(Boolean) || []
        );
    }, [instances]);
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedInstanceIds();
    const isAllSelected =
        currentPageInstanceUids.length > 0 &&
        currentPageInstanceUids.every((instanceId) =>
            selectedInstanceIds.has(instanceId as string),
        );

    const { mutate: recycleDicomInstances } = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds: selectedIds,
        }),
        meta: {
            toastId: nanoid()
        },
        onMutate: (_, context) => {
            toast.loading("Recycling DICOM instances...", {
                id: context.meta?.toastId as string,
            });
        },
        onSuccess: (_, __, ___, context) => {
            toast.success("DICOM instances recycled successfully");
            toast.dismiss(context.meta?.toastId as string);
            clearSelection();
            queryClient.invalidateQueries({
                queryKey: ["dicom-instance", workspaceId, studyInstanceUid, seriesInstanceUid],
            });
        },
        onError: (_, __, ___, context) => {
            toast.error("Failed to recycle DICOM instances");
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
            queryKey: ["dicom-instance", workspaceId, studyInstanceUid, seriesInstanceUid, 0, ITEM_PER_PAGE],
        });
    }, [searchConditions]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageInstanceUids);
        }
    };

    const { handleDownload: handleDicomDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstance(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstances(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download selected instances",
    });

    const { handleDownload: handleJpgDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsJpg(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download selected instances as jpg",
    });

    const { handleDownload: handlePngDownload } = useDownloadHandler({
        downloadSingle: (id: string) =>
            downloadInstanceAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                id,
            ),
        downloadMultiple: (ids: string[]) =>
            downloadMultipleInstancesAsPng(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                ids,
            ),
        errorMessage: "Failed to download selected instances as png",
    });

    const downloadOptions = [
        {
            label: "DICOM",
            onClick: () => handleDicomDownload(selectedIds),
        },
        {
            label: "JPG",
            onClick: () => handleJpgDownload(selectedIds),
        },
        {
            label: "PNG",
            onClick: () => handlePngDownload(selectedIds),
        }
    ]

    if (error) {
        return (
            <EmptyState
                title="載入失敗"
                description="無法載入 DICOM instances 資料"
            />
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex flex-col items-start space-x-4">
                <div className="flex flex-1 items-center space-x-4">
                    <Link href={`/${workspaceId}/dicom-studies/${studyInstanceUid}`}>
                        <Button 
                            variant="outline" 
                            className="flex items-center"
                            onClick={() => {
                                setSearchConditionsForType("dicom-instance", {});
                            }}
                        >
                            <ArrowLeftIcon className="size-4" />
                        </Button>
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            DICOM Instances
                        </h1>
                        <p className="text-gray-600">
                            Study Instance UID: {studyInstanceUid}
                        </p>
                        <p className="text-gray-600">
                            Series Instance UID: {seriesInstanceUid}
                        </p>
                    </div>
                </div>
            </div>

            {!isLoading && instances && instances.length > 0 && (
                <SelectionControlBar
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onRecycle={() => recycleDicomInstances()}
                    downloadOptions={downloadOptions}
                    dicomLevel="instance"
                />
            )}

            {isLoading ? (
                layoutMode === "grid" ? (
                    <LoadingGrid itemCount={ITEM_PER_PAGE} />
                ) : (
                    <LoadingDataTable columns={5} rows={ITEM_PER_PAGE} />
                )
            ) : instances && instances.length > 0 ? (
                <>
                    {layoutMode === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                            {instances.map((instance, index) => (
                                <DicomInstanceCard
                                    // biome-ignore lint/suspicious/noArrayIndexKey: 使用 sop instance uid 會出現 type error，所以直接使用 index
                                    key={index}
                                    instance={instance as DicomInstanceData}
                                    workspaceId={workspaceId}
                                    studyInstanceUid={studyInstanceUid}
                                    seriesInstanceUid={seriesInstanceUid}
                                    type="management"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mb-8">
                            <DicomInstancesDataTable
                                instances={instances as DicomInstanceData[]}
                                workspaceId={workspaceId}
                                className="mb-8"
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
                <EmptyState
                    title="沒有資料"
                    description="目前沒有可顯示的 Instances"
                />
            )}
        </div>
    );
}
