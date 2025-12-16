"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { SharedDicomStudyCard } from "@/components/share/shared-dicom-study-card";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadShareMultipleStudies } from "@/lib/clientDownload";
import { getShareStudiesQuery } from "@/react-query/queries/publicShare";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { useLayoutStore } from "@/stores/layout-store";
import { SharedDicomStudiesDataTable } from "../data-tables/shared-dicom-studies-data-table";

interface SharedStudiesViewProps {
    token: string;
    password?: string;
    publicPermissions?: number;
}

const ITEM_PER_PAGE = 10;

export default function SharedStudiesView({
    token,
    password,
    publicPermissions = 0,
}: SharedStudiesViewProps) {
    const searchParams = useSearchParams();
    const layoutMode = useLayoutStore((state) => state.layoutMode);

    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } =
        usePagination();

    const { open: openBlueLightViewer, close: closeBlueLightViewer } =
        useBlueLightViewerStore();

    const { clearSelection, getSelectedCount, selectAll, getSelectedStudyIds } =
        useDicomStudySelectionStore();
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedStudyIds();

    const { data: studies, isLoading } = useQuery(
        getShareStudiesQuery({
            token,
            password,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        }),
    );
    const isAllSelected = selectedCount === studies?.length;

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    useEffect(() => {
        return () => {
            clearSelection();
            closeBlueLightViewer();
        };
    }, [clearSelection, closeBlueLightViewer]);

    useEffect(() => {
        const shareToken = searchParams.get("shareToken");
        const studyInstanceUid = searchParams.get("openStudyInstanceUid");
        if (shareToken && studyInstanceUid) {
            openBlueLightViewer({
                shareToken,
                studyInstanceUid,
            });
        }
    }, [openBlueLightViewer, searchParams]);

    const canGoNext = studies && studies.length === ITEM_PER_PAGE;

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(
                studies?.map(
                    (study) => study["0020000D"]?.Value?.[0] as string,
                ) || [],
            );
        }
    };

    const handleDownload = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one study to download");
            return;
        }

        try {
            await downloadShareMultipleStudies(token, selectedIds, password);
        } catch (error) {
            console.error("Failed to download selected studies", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected studies");
        }
    };

    if (isLoading) {
        return layoutMode === "grid" ? (
            <LoadingGrid itemCount={ITEM_PER_PAGE} />
        ) : (
            <LoadingDataTable columns={7} rows={ITEM_PER_PAGE} />
        );
    }

    if (!studies || studies.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No studies available
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
                dicomLevel="study"
            />

            {layoutMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {studies.map((study) => (
                        <SharedDicomStudyCard
                            key={study["0020000D"].Value[0] as string}
                            study={study}
                            token={token}
                            password={password}
                            publicPermissions={publicPermissions}
                        />
                    ))}
                </div>
            ) : (
                <SharedDicomStudiesDataTable
                    studies={studies}
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
