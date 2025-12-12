"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { createInstanceColumns } from "@/components/dicom/data-tables/table-instance-columns";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { SharedDicomInstanceCard } from "@/components/share/shared-dicom-instance-card";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadShareMultipleInstances } from "@/lib/clientDownload";
import { getShareInstancesQuery } from "@/react-query/queries/publicShare";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useLayoutStore } from "@/stores/layout-store";
import { SharedDicomInstancesDataTable } from "../data-tables/shared-dicom-instances-data-table";
import { useT } from "@/app/_i18n/client";

interface SharedInstancesViewProps {
    token: string;
    password?: string;
    publicPermissions?: number;
}

const ITEM_PER_PAGE = 10;

export default function SharedInstancesView({ 
    token, 
    password,
    publicPermissions = 0,
}: SharedInstancesViewProps) {
    const { t } = useT("translation");
    const layoutMode = useLayoutStore((state) => state.layoutMode);
    const { 
        currentPage, 
        handlePreviousPage, 
        handleNextPage, 
        canGoPrevious 
    } = usePagination();

    const { clearSelection, getSelectedCount, selectAll, getSelectedInstanceIds } = useDicomInstanceSelectionStore();
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedInstanceIds();

    const { data: instances, isLoading } = useQuery(
        getShareInstancesQuery({
            token,
            password,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        })
    );
    const isAllSelected = selectedCount === instances?.length;
    const studyInstanceUid = instances?.[0]["0020000D"]?.Value?.[0] as string;
    const seriesInstanceUid = instances?.[0]["0020000E"]?.Value?.[0] as string;

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    useEffect(() => {
        return () => {
            clearSelection();
        };
    }, [clearSelection]);

    const canGoNext = instances && instances.length === ITEM_PER_PAGE;
    const columns = useMemo(() => createInstanceColumns(t), [t]);

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(instances?.map((instance) => instance["00080018"]?.Value?.[0] as string) || []);
        }
    }

    const handleDownload = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one instance to download");
            return;
        }

        try {
            await downloadShareMultipleInstances(
                token,
                studyInstanceUid,
                seriesInstanceUid,
                selectedIds,
                password,
            );
        } catch (error) {
            console.error("Failed to download selected instances", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected instances");
        }
    }

    if (isLoading) {
        return layoutMode === "grid" ? (
            <LoadingGrid itemCount={ITEM_PER_PAGE} />
        ) : (
            <LoadingDataTable columns={columns.length} rows={ITEM_PER_PAGE} />
        );
    }

    if (!instances || instances.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No instances available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <SelectionControlBar 
                selectedCount={selectedCount}
                isAllSelected={isAllSelected}
                onSelectAll={handleSelectAll}
                onClearSelection={clearSelection}
                onDownload={handleDownload}
                dicomLevel="instance"
            />

            {layoutMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {instances.map((instance) => (
                        <SharedDicomInstanceCard
                            key={instance["00080018"].Value[0] as string}
                            instance={instance as DicomInstanceData}
                            token={token}
                            password={password}
                            publicPermissions={publicPermissions}
                        />
                    ))}
                </div>
            ) : (
                <SharedDicomInstancesDataTable 
                    instances={instances as DicomInstanceData[]}
                    token={token}
                    password={password}
                    publicPermissions={publicPermissions}
                />
            )}

            <PaginationControls
                canGoPrevious={canGoPrevious}
                canGoNext={Boolean(canGoNext)}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
            />
        </div>
    );
}