"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { LoadingDataTable } from "@/components/common/loading-data-table";
import { LoadingGrid } from "@/components/common/loading-grid";
import { PaginationControls } from "@/components/common/pagination-controls";
import { createInstanceColumns } from "@/components/dicom/data-tables/table-instance-columns";
import { SelectionControlBar } from "@/components/dicom/selection-control-bar";
import { SharedDicomInstancesDataTable } from "@/components/share/data-tables/shared-dicom-instances-data-table";
import { ShareBreadcrumb } from "@/components/share/share-breadcrumb";
import { SharedDicomInstanceCard } from "@/components/share/shared-dicom-instance-card";
import { Card, CardHeader } from "@/components/ui/card";
import { useClearSelectionOnBlankClick } from "@/hooks/use-clear-selection-on-blank-click";
import { usePagination } from "@/hooks/use-pagination";
import { downloadShareMultipleInstances } from "@/lib/clientDownload";
import { getPublicShareLinkQuery, getShareStudySeriesInstancesQuery } from "@/react-query/queries/publicShare";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { useLayoutStore } from "@/stores/layout-store";

interface ShareStudySeriesInstancesContentProps {
    token: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    password?: string;
}

const ITEM_PER_PAGE = 10;

export default function ShareStudySeriesInstancesContent({ token, studyInstanceUid, seriesInstanceUid, password }: ShareStudySeriesInstancesContentProps) {
    const searchParams = useSearchParams();
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

    const { open: openBlueLightViewer, close: closeBlueLightViewer } = useBlueLightViewerStore();

    const { data: publicShareLink } = useQuery(
        getPublicShareLinkQuery({
            token,
            password,
        })
    );

    const { data: instances, isLoading } = useQuery(
        getShareStudySeriesInstancesQuery({
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            offset: currentPage * ITEM_PER_PAGE,
            limit: ITEM_PER_PAGE,
        })
    );
    const isAllSelected = selectedCount === instances?.length;

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
        const seriesInstanceUid = searchParams.get("openSeriesInstanceUid");
        const sopInstanceUid = searchParams.get("openSopInstanceUid");
        const password = searchParams.get("password");

        if (shareToken && studyInstanceUid && seriesInstanceUid && sopInstanceUid) {
            openBlueLightViewer({
                shareToken,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
                password: password ? decodeURIComponent(password) : undefined,
            });
        }
    }, [openBlueLightViewer, searchParams]);

    const canGoNext = instances && instances.length === ITEM_PER_PAGE;

    const passwordParam = password ? `?password=${encodeURIComponent(password)}` : "";

    const truncateUid = (uid: string) => 
        uid.length > 20 ? `${uid.slice(0, 10)}...${uid.slice(-10)}` : uid;

    const breadcrumbItems = publicShareLink?.data?.targetType === "study" ? [
        { 
            label: "Studies", 
            href: `/share/${token}${passwordParam}` 
        },
        { 
            label: truncateUid(studyInstanceUid),
        },
        { 
            label: "Series",
            href: `/share/${token}/studies/${studyInstanceUid}${passwordParam}`
        },
        { 
            label: truncateUid(seriesInstanceUid)
        },
        { 
            label: "Instances" 
        },
    ] : [
        {
            label: "Series",
            href: `/share/${token}${passwordParam}`
        },
        {
            label: truncateUid(seriesInstanceUid),
        },
        {
            label: "Instances"
        }
    ];

    const columns = useMemo(() => createInstanceColumns(), []);

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
                    <LoadingDataTable columns={columns.length} rows={ITEM_PER_PAGE} />
                )}
            </div>
        )
    }

    if (!instances || instances.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No instances available
            </div>
        );
    }

    const publicPermissions = publicShareLink?.data?.publicPermissions ?? 0;

    return (
        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <ShareBreadcrumb items={breadcrumbItems} />
                    <div className="text-sm text-muted-foreground mt-2">
                        {instances?.length || 0} instances in this series
                    </div>
                </CardHeader>
            </Card>

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
            ): (
                <SharedDicomInstancesDataTable 
                    token={token}
                    password={password}
                    publicPermissions={publicPermissions}
                    instances={instances as DicomInstanceData[]}
                />
            )}

            <PaginationControls
                canGoPrevious={canGoPrevious}
                canGoNext={Boolean(canGoNext)}
                onPrevious={handlePreviousPage}
                onNext={handleNextPage}
            />
        </div>
    )
}