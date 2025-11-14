"use client";

import type { DicomInstanceData } from "@brigid/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { DicomInstanceContextMenu } from "@/components/dicom/dicom-instance-context-menu";
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
import { downloadInstance } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    getDicomInstanceThumbnailQuery,
    recycleDicomInstanceMutation,
} from "@/react-query/queries/dicomInstance";
import { useDicomInstanceSelectionStore } from "@/stores/dicom-instance-selection-store";

interface DicomInstancesTableProps {
    instances: DicomInstanceData[];
    workspaceId: string;
    className?: string;
}

function ThumbnailCell({
    workspaceId,
    instance,
}: {
    workspaceId: string;
    instance: DicomInstanceData;
}) {
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";

    const { data: thumbnail, isLoading: isLoadingThumbnail } = useQuery({
        ...getDicomInstanceThumbnailQuery(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            "64,64",
        ),
        enabled: sopInstanceUid !== "N/A",
    });

    const thumbnailUrl = useDicomThumbnail(thumbnail);

    if (isLoadingThumbnail) {
        return <Skeleton className="size-16 rounded" />;
    }

    return thumbnailUrl && sopInstanceUid !== "N/A" ? (
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
    workspaceId,
}: {
    instance: DicomInstanceData;
    workspaceId: string;
}) {
    const queryClient = getQueryClient();
    const studyInstanceUid = instance["0020000D"]?.Value?.[0] || "N/A";
    const seriesInstanceUid = instance["0020000E"]?.Value?.[0] || "N/A";
    const sopInstanceUid = instance["00080018"]?.Value?.[0] || "N/A";

    const { mutate: recycleDicomInstance } = useMutation({
        ...recycleDicomInstanceMutation({
            workspaceId,
            instanceIds: [sopInstanceUid],
        }),
        onMutate: () => {
            toast.loading("Recycling DICOM instance...", {
                id: `recycle-${sopInstanceUid}`,
            });
        },
        onSuccess: () => {
            toast.success("DICOM instance recycled successfully");
            toast.dismiss(`recycle-${sopInstanceUid}`);
            queryClient.invalidateQueries({
                queryKey: [
                    "dicom-instance",
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                ],
            });
        },
        onError: () => {
            toast.error("Failed to recycle DICOM instance");
            toast.dismiss(`recycle-${sopInstanceUid}`);
        },
    });

    const handleDownloadInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        downloadInstance(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        );
    };

    const handleCopySopInstanceUid = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        navigator.clipboard.writeText(sopInstanceUid);
    };

    const handleRecycleInstance = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        recycleDicomInstance();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="size-8 p-0">
                    <span className="sr-only">Open Menu</span>
                    <MoreHorizontalIcon className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopySopInstanceUid}>
                    Copy SOP Instance UID
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleDownloadInstance}>
                    Download Instance
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleRecycleInstance}>
                    Recycle Instance
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function DicomInstancesDataTable({
    instances,
    workspaceId,
    className,
}: DicomInstancesTableProps) {
    const {
        toggleInstanceSelection,
        isInstanceSelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectInstance,
    } = useDicomInstanceSelectionStore();

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
                            const isChecked = !!value;
                            if (isChecked) {
                                selectAll(
                                    instances.map(
                                        (instance) =>
                                            instance["00080018"]?.Value?.[0] ||
                                            "",
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
                    const isSelected = isInstanceSelected(sopInstanceUid);

                    return (
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => {
                                toggleInstanceSelection(sopInstanceUid, true);
                            }}
                            aria-label="Select instance"
                        />
                    );
                },
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: "thumbnail",
                header: "Thumbnail",
                cell: ({ row }) => {
                    return (
                        <ThumbnailCell
                            workspaceId={workspaceId}
                            instance={row.original}
                        />
                    );
                },
            },
            {
                accessorKey: "instanceNumber",
                header: "Instance Number",
                cell: ({ row }) => {
                    const instanceNumber =
                        row.original["00200013"]?.Value?.[0] || "N/A";
                    return <div>{instanceNumber}</div>;
                },
            },
            {
                accessorKey: "acquisitionDate",
                header: "Acquisition Date",
                cell: ({ row }) => {
                    const acquisitionDate =
                        row.original["00080022"]?.Value?.[0] || "N/A";
                    return <div>{acquisitionDate}</div>;
                },
            },
            {
                accessorKey: "contentDate",
                header: "Content Date",
                cell: ({ row }) => {
                    const contentDate =
                        row.original["00080023"]?.Value?.[0] || "N/A";
                    return <div>{contentDate}</div>;
                },
            },
            {
                accessorKey: "sopInstanceUid",
                header: "SOP Instance UID",
                cell: ({ row }) => {
                    const sopInstanceUid =
                        row.original["00080018"]?.Value?.[0] || "N/A";
                    return <div>{sopInstanceUid}</div>;
                },
            },
            {
                accessorKey: "sopClassUid",
                header: "SOP Class UID",
                cell: ({ row }) => {
                    const sopClassUid =
                        row.original["00080016"]?.Value?.[0] || "N/A";
                    return <div>{sopClassUid}</div>;
                },
            },
            {
                accessorKey: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    return (
                        <ActionsCell
                            workspaceId={workspaceId}
                            instance={row.original}
                        />
                    );
                },
            },
        ],
        [
            workspaceId,
            instances,
            clearSelection,
            selectAll,
            getSelectedCount,
            isInstanceSelected,
            toggleInstanceSelection,
        ],
    );

    const table = useReactTable({
        data: instances,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            rowSelection: instances.reduce((acc, instance) => {
                const sopInstanceUid = instance["00080018"]?.Value?.[0] || "";
                if (isInstanceSelected(sopInstanceUid)) {
                    acc[sopInstanceUid] = true;
                }
                return acc;
            }),
        },
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
                                    <DicomInstanceContextMenu
                                        key={row.id}
                                        workspaceId={workspaceId}
                                        studyInstanceUid={studyInstanceUid}
                                        seriesInstanceUid={seriesInstanceUid}
                                    >
                                        <TableRow
                                            data-dicom-card
                                            onClick={(e) =>
                                                handleRowClick(e, row.original)
                                            }
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50",
                                            )}
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
                                    </DicomInstanceContextMenu>
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
