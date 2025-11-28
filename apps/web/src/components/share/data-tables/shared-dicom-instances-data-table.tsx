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
import { useMemo } from "react";
import { toast } from "sonner";
import { createInstanceColumns } from "@/components/dicom/data-tables/table-instance-columns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";
import { SharedDicomInstanceContextMenu } from "../shared-dicom-instance-context-menu";

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
}: {
    instance: DicomInstanceData;
    token: string;
    password?: string;
}) {
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";
    const { open: openBlueLightViewer } = useBlueLightViewerStore();

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
            console.error("Failed to download instance", error);

            if (error instanceof Error && error.name === "AbortError") {
                return;
            }

            toast.error("Failed to download instance");
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopySopInstanceUid}>
                    Copy SOP Instance UID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenBlueLightViewer}>
                    Open in BlueLight Viewer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                    Download Instance
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function SharedDicomInstancesDataTable({
    instances,
    token,
    password,
    publicPermissions = 0,
    className,
}: SharedDicomInstancesDataTableProps) {
    const {
        toggleInstanceSelection,
        isInstanceSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectInstance,
    } = useDicomInstanceSelectionStore();

    const generalColumns = useMemo(() => createInstanceColumns(), []);

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
                header: "Preview",
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
            ...generalColumns,
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }) => (
                    <ActionsCell
                        instance={row.original}
                        token={token}
                        password={password}
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
