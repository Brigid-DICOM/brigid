"use client";

import type { DicomSeriesData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { createSeriesColumns } from "@/components/dicom/data-tables/table-series-columns";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { SharedDicomSeriesDataTable } from "@/components/share/data-tables/shared-dicom-series-data-table";
import { ShareBreadcrumb } from "@/components/share/share-breadcrumb";
import { SharedDicomSeriesCard } from "@/components/share/shared-dicom-series-card";
import { Card, CardHeader } from "@/components/ui/card";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadShareMultipleSeries } from "@/lib/clientDownload";
import {
    getPublicShareLinkQuery,
    getShareStudySeriesQuery,
} from "@/react-query/queries/publicShare";
import { useDicomSeriesSelectionStore } from "@/stores/dicom-series-selection-store";
import { useLayoutStore } from "@/stores/layout-store";
import { useT } from "@/app/_i18n/client";
import { useParams } from "next/navigation";

interface ShareStudySeriesContentProps {
    token: string;
    studyInstanceUid: string;
    password?: string;
}

const ITEM_PER_PAGE = 10;

export default function ShareStudySeriesContent({
    token,
    studyInstanceUid,
    password,
}: ShareStudySeriesContentProps) {
    const { t } = useT("translation");
    const { lng } = useParams<{ lng: string }>();
    const layoutMode = useLayoutStore((state) => state.layoutMode);
    const { currentPage, handlePreviousPage, handleNextPage, canGoPrevious } =
        usePagination();

    const { clearSelection, getSelectedCount, selectAll, getSelectedSeriesIds } = useDicomSeriesSelectionStore();
    const selectedCount = getSelectedCount();
    const selectedIds = getSelectedSeriesIds();

    const { data: publicShareLink } = useQuery(
        getPublicShareLinkQuery({
            token,
            password,
        }),
    );

    const { data: series, isLoading } = useQuery(
        getShareStudySeriesQuery({
            token,
            password,
            studyInstanceUid,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        }),
    );
    const isAllSelected = selectedCount === series?.length;

    useClearSelectionOnBlankClick({
        clearSelection,
        enabled: selectedCount > 0 && layoutMode === "grid",
    });

    useEffect(() => {
        return () => {
            clearSelection();
        };
    }, [clearSelection]);

    const passwordParam = password
        ? `?password=${encodeURIComponent(password)}`
        : "";

    const breadcrumbItems = [
        {
            label: "Studies",
            href: `/${lng}/share/${token}${passwordParam}`,
        },
        {
            label:
                studyInstanceUid.length > 20
                    ? `${studyInstanceUid.slice(0, 10)}...${studyInstanceUid.slice(-10)}`
                    : studyInstanceUid,
        },
        {
            label: "Series",
        },
    ];

    const canGoNext = series && series.length === ITEM_PER_PAGE;
    const columns = useMemo(() => createSeriesColumns(t), [t]);
    const publicPermissions = publicShareLink?.data?.publicPermissions ?? 0;

    const handleSelectAll = () => {
        if (isAllSelected) {
            clearSelection();
        } else {
            selectAll(series?.map((aSeries) => aSeries["0020000E"]?.Value?.[0] as string) || []);
        }
    }

    const handleDownload = async () => {
        if (selectedIds.length === 0) {
            toast.error("Please select at least one series to download");
            return;
        }

        try {
            await downloadShareMultipleSeries(
                token,
                studyInstanceUid,
                selectedIds,
                password,
            );
        } catch (error) {
            console.error("Failed to download selected series", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download selected series");
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <ShareBreadcrumb items={breadcrumbItems} />
                    </CardHeader>
                </Card>

                {layoutMode === "grid" ? (
                    <LoadingGrid itemCount={ITEM_PER_PAGE} />
                ) : (
                    <LoadingDataTable
                        columns={columns.length}
                        rows={ITEM_PER_PAGE}
                    />
                )}
            </div>
        );
    }

    if (!series || series.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No series available
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <ShareBreadcrumb items={breadcrumbItems} />
                    <div className="text-sm text-muted-foreground mt-2">
                        {series?.length || 0} series in this study
                    </div>
                </CardHeader>
            </Card>

            <SelectionControlBar 
                    selectedCount={selectedCount}
                    isAllSelected={isAllSelected}
                    onSelectAll={handleSelectAll}
                    onClearSelection={clearSelection}
                    onDownload={handleDownload}
                    dicomLevel="series"
            />

            {layoutMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {series.map((seriesItem) => (
                        <SharedDicomSeriesCard
                            key={seriesItem["0020000E"].Value[0] as string}
                            series={seriesItem as DicomSeriesData}
                            token={token}
                            password={password}
                            publicPermissions={
                                publicPermissions
                            }
                        />
                    ))}
                </div>
            ) : (
                <SharedDicomSeriesDataTable
                    series={series as DicomSeriesData[]}
                    token={token}
                    password={password}
                    publicPermissions={
                        publicPermissions
                    }
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
