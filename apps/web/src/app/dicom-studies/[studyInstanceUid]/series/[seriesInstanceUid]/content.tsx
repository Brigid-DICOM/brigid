"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { EmptyState } from "@/components/common/empty-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { DicomInstanceCard } from "@/components/dicom/dicom-instance-card";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { Button } from "@/components/ui/button";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { useDownloadHandler } from "@/hooks/use-download-handler";
import { usePagination } from "@/hooks/use-pagination";
import { downloadInstance, downloadMultipleInstances } from "@/lib/clientDownload";
import { getDicomInstanceQuery } from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
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
    const ITEM_PER_PAGE = 10;

    const { layoutMode } = useLayoutStore();

    const {
        selectedInstanceIds,
        clearSelection,
        selectAll,
        getSelectedCount,
        getSelectedInstanceIds
    } = useDicomInstanceSelectionStore();

    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } = usePagination();
    const {
        data: instances,
        isLoading,
        error
    } = useQuery(
        getDicomInstanceQuery({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        })
    );
    const canGoNext = instances && instances.length === ITEM_PER_PAGE;

    const currentPageInstanceUids = useMemo(() => {
        return (
            instances?.map((instance) => instance["00080018"]?.Value?.[0] as string)
                .filter(Boolean) || []
        );
    }, [instances]);
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedInstanceIds();
    const isAllSelected = 
        currentPageInstanceUids.length > 0 && 
        currentPageInstanceUids.every((instanceId) => 
            selectedInstanceIds.has(instanceId as string)
    );

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(currentPageInstanceUids);
        }
    }

    const { handleDownload } = useDownloadHandler({
        downloadSingle: (id: string) => downloadInstance(workspaceId, studyInstanceUid, seriesInstanceUid, id),
        downloadMultiple: (ids: string[]) => downloadMultipleInstances(workspaceId, studyInstanceUid, seriesInstanceUid, ids),
        errorMessage: "Failed to download selected instances",
    });

    if (error) {
        return (
            <EmptyState 
                title="載入失敗"
                description="無法載入 DICOM instances 資料"
            />
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex items-center space-x-4">
                <Link href={`/dicom-studies/${studyInstanceUid}`}>
                    <Button
                        variant="outline"
                        className="flex items-center"
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

            {!isLoading && instances && instances.length > 0 && (
                <SelectionControlBar 
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onDownload={() => handleDownload(selectedIds)}
                    multiDownloadLabel="Download Selected Instances"
                />
            )}

            {isLoading ? (
                <LoadingGrid
                    itemCount={ITEM_PER_PAGE}
                />
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
                        />
                    ))}    
                    </div>): (
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
            ): (
                <EmptyState 
                    title="沒有資料"
                    description="目前沒有可顯示的 Instances"
                />
            )}
        </div>
    );
}