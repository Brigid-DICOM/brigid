"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { createInstanceColumns } from "@/components/dicom/data-tables/table-instance-columns";
import { DicomDataTableTagCell } from "@/components/dicom/dicom-data-table-tag-cell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDicomThumbnail } from "@/hooks/use-dicom-thumbnail";
import { downloadShareInstance } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { getShareInstanceThumbnailQuery } from "@/react-query/queries/publicShare";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { SharedDicomInstanceContextMenu } from "../shared-dicom-instance-context-menu";
import { ShareCreateTagDialog } from "../tag/share-create-tag-dialog";
import { ShareTagDropdownSub } from "../tag/share-tag-dropdown-sub";

interface SharedDicomInstancesDataTableProps {
    instances: DicomInstanceData[];
    token: string;
    password?: string;
    publicPermissions?: number;
    className?: string;
}

function ThumbnailCell({
    token,
    password,
    studyInstanceUid,
    seriesInstanceUid,
    sopInstanceUid,
}: {
    token: string;
    password?: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
}) {
    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery(
        getShareInstanceThumbnailQuery({
            token,
            password,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            viewport: "64,64",
        }),
    );

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    if (isLoadingThumbnail) {
        return <Skeleton className="size-16 rounded" />;
    }

    return thumbnailUrl ? (
        <Image
            src={thumbnailUrl}
            alt="DICOM Instance Thumbnail"
            width={64}
            height={64}
            className="size-16 object-cover rounded"
            unoptimized
        />
    ) : (
        <div className="size-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
            No image
        </div>
    );
}

function ActionsCell({
    instance,
    token,
    password,
    publicPermissions = 0,
}: {
    instance: DicomInstanceData;
    token: string;
    password?: string;
    publicPermissions?: number;
}) {
    const { t } = useT("translation");
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const { open: openBlueLightViewer } = useBlueLightViewerStore();

    const canUpdate = hasPermission(
        publicPermissions,
        SHARE_PERMISSIONS.UPDATE,
    );

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(sopInstanceUid);
    };

    const handleDownload = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        try {
            await downloadShareInstance({
                token,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
                password,
            });
        } catch (error) {
            console.error(t("dicom.messages.failedToDownload", { level: "instance" }), error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error(t("dicom.messages.failedToDownload", { level: "instance" }));
        }
    };

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            shareToken: token,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            password,
        });
    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <span className="sr-only">{t("dicom.contextMenu.openMenu")}</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCopySopInstanceUid}>
                        {t("dicom.contextMenu.copy")} {t("dicom.columns.instance.sopInstanceUid")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenBlueLightViewer}>
                        {t("dicom.contextMenu.openInBlueLight")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                        {t("dicom.contextMenu.download")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {canUpdate && (
                        <ShareTagDropdownSub 
                            token={token}
                            targetType="instance"
                            targetId={sopInstanceUid}
                            password={password}
                            onOpenCreateTagDialog={() => setOpenCreateTagDialog(true)}
                        />
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ShareCreateTagDialog 
                open={openCreateTagDialog}
                onOpenChange={setOpenCreateTagDialog}
                token={token}
                targetType="instance"
                targetId={sopInstanceUid}
                password={password}
            />
        </>
    );
}

export function SharedDicomInstancesDataTable({
    instances,
    token,
    password,
    publicPermissions = 0,
    className,
}: SharedDicomInstancesDataTableProps) {
    const { t } = useT("translation");
    const {
        toggleInstanceSelection,
        isInstanceSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectInstance,
    } = useDicomInstanceSelectionStore();

    const generalColumns = useMemo(() => createInstanceColumns(t), [t]);

    const columns: ColumnDef<DicomInstanceData>[] = useMemo(
        () => [
            {
                id: "select",
                header: () => (
                    <Checkbox
                        checked={
                            getSelectedCount() > 0 &&
                            getSelectedCount() === instances.length
                        }
                        onCheckedChange={(value) => {
                            if (value) {
                                selectAll(
                                    instances.map(
                                        (i) => i["00080018"]?.Value?.[0] || "",
                                    ),
                                );
                            } else {
                                clearSelection();
                            }
                        }}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => {
                    const sopInstanceUid =
                        row.original["00080018"]?.Value?.[0] || "";
                    return (
                        <Checkbox
                            checked={isInstanceSelected(sopInstanceUid)}
                            onCheckedChange={() =>
                                toggleInstanceSelection(sopInstanceUid, true)
                            }
                            aria-label="Select instance"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "thumbnail",
                header: t("dicom.columns.preview"),
                cell: ({ row }) => (
                    <ThumbnailCell
                        token={token}
                        password={password}
                        studyInstanceUid={
                            row.original["0020000D"]?.Value?.[0] || "N/A"
                        }
                        seriesInstanceUid={
                            row.original["0020000E"]?.Value?.[0] || "N/A"
                        }
                        sopInstanceUid={
                            row.original["00080018"]?.Value?.[0] || "N/A"
                        }
                    />
                ),
            },
            {
                accessorKey: "tags",
                header: t("dicom.columns.tags"),
                cell: ({ row }) => (
                    <DicomDataTableTagCell
                        mode="share"
                        token={token}
                        targetType="instance"
                        targetId={row.original["00080018"]?.Value?.[0] || ""}
                        password={password}
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...generalColumns,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <ActionsCell
                        instance={row.original}
                        token={token}
                        password={password}
                        publicPermissions={publicPermissions}
                    />
                ),
            },
        ],
        [
            token,
            password,
            instances,
            clearSelection,
            selectAll,
            getSelectedCount,
            isInstanceSelected,
            toggleInstanceSelection,
            generalColumns,
            publicPermissions,
            t
        ],
    );

    const table = useReactTable({
        data: instances,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false,
    });

    const handleRowClick = (
        e: React.MouseEvent<HTMLTableRowElement>,
        instance: DicomInstanceData,
    ) => {
        const sopInstanceUid = instance["00080018"]?.Value?.[0] || "";
        if (e.button !== 0) return;

        const target = e.target as HTMLElement;
        if (
            target.closest('[role="checkbox"]') ||
            target.closest('[role="menuitem"]') ||
            target.closest("button")
        ) {
            return;
        }

        e.preventDefault();
        toggleInstanceSelection(sopInstanceUid, true);
    };

    return (
        <div className={cn("w-full", className)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const studyInstanceUid =
                                    row.original["0020000D"]?.Value?.[0] || "";
                                const seriesInstanceUid =
                                    row.original["0020000E"]?.Value?.[0] || "";
                                const sopInstanceUid =
                                    row.original["00080018"]?.Value?.[0] || "";
                                const isSelected =
                                    isInstanceSelected(sopInstanceUid);

                                return (
                                    <SharedDicomInstanceContextMenu
                                        key={row.id}
                                        token={token}
                                        password={password}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                        sopInstanceUid={sopInstanceUid}
                                        publicPermissions={publicPermissions}
                                    >
                                        <TableRow
                                            data-dicom-card
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50",
                                            )}
                                            onClick={(e) =>
                                                handleRowClick(e, row.original)
                                            }
                                            onContextMenu={() => {
                                                if (getSelectedCount() === 0) {
                                                    selectInstance(
                                                        sopInstanceUid,
                                                    );
                                                } else if (
                                                    getSelectedCount() === 1
                                                ) {
                                                    clearSelection();
                                                    selectInstance(
                                                        sopInstanceUid,
                                                    );
                                                }
                                            }}
                                        >
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </SharedDicomInstanceContextMenu>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t("dicom.messages.noData", { level: "instances" })}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
