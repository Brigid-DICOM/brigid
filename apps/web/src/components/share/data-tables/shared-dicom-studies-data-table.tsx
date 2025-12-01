"use client";

import type { DicomStudyData } from "@brigid/types";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createStudyColumns } from "@/components/dicom/data-tables/table-study-columns";
import { TableThumbnailCell } from "@/components/dicom/data-tables/table-thumbnail-cell";
import { DicomDataTableTagCell } from "@/components/dicom/dicom-data-table-tag-cell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { downloadShareStudy } from "@/lib/clientDownload";
import { cn } from "@/lib/utils";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { useBlueLightViewerStore } from "@/stores/bluelight-viewer-store";
import { useDicomStudySelectionStore } from "@/stores/dicom-study-selection-store";
import { SharedDicomStudyContextMenu } from "../shared-dicom-study-context-menu";
import { ShareCreateTagDialog } from "../tag/share-create-tag-dialog";
import { ShareTagDropdownSub } from "../tag/share-tag-dropdown-sub";

interface SharedDicomStudiesDataTableProps {
    studies: DicomStudyData[];
    token: string;
    publicPermissions?: number;
    password?: string;
    className?: string;
}

function ActionsCell({
    token,
    study,
    password,
    publicPermissions = 0,
}: {
    token: string;
    study: DicomStudyData;
    password?: string
    publicPermissions?: number;
}) {
    const router = useRouter();
    const studyInstanceUid = study["0020000D"]?.Value?.[0] || "N/A";
    const [openCreateTagDialog, setOpenCreateTagDialog] = useState(false);
    const { clearSelection } = useDicomStudySelectionStore();
    const { open: openBlueLightViewer } = useBlueLightViewerStore();

    const canUpdate = hasPermission(
        publicPermissions,
        SHARE_PERMISSIONS.UPDATE,
    );

    const handleEnterSeries = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        clearSelection();
        const params = password ? `?password=${encodeURIComponent(password)}` : "";
        router.push(`/share/${token}/studies/${studyInstanceUid}${params}`);
    }

    const handleDownloadStudy = async (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        try {
            await downloadShareStudy({
                token,
                studyInstanceUid,
                password,
            });
        } catch (error) {
            console.error("Failed to download study", error);
            toast.error("Failed to download study");
        }
    }

    const handleOpenBlueLightViewer = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openBlueLightViewer({
            shareToken: token,
            studyInstanceUid,
            password,
        });
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className="size-8 p-0"
                    >
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontalIcon className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEnterSeries}>
                        Enter Series
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenBlueLightViewer}>
                        Open in BlueLight Viewer
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownloadStudy}>
                        Download Study
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {canUpdate && (
                        <ShareTagDropdownSub 
                        token={token}
                        targetType="study"
                        targetId={studyInstanceUid}
                        password={password}
                        onOpenCreateTagDialog={() => setOpenCreateTagDialog(true)}
                        />
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {canUpdate && (
                <ShareCreateTagDialog 
                    open={openCreateTagDialog}
                    onOpenChange={setOpenCreateTagDialog}
                    token={token}
                    targetType="study"
                    targetId={studyInstanceUid}
                    password={password}
                />
            )}
        </>
    )
}

export function SharedDicomStudiesDataTable({
    studies,
    token,
    password,
    publicPermissions = 0,
    className
}: SharedDicomStudiesDataTableProps) {
    const {
        toggleStudySelection,
        isStudySelected,
        clearSelection,
        selectAll,
        getSelectedCount,
        selectStudy
    } = useDicomStudySelectionStore();

    const generalColumns = useMemo(() => createStudyColumns(), []);

    const columns: ColumnDef<DicomStudyData>[] = useMemo(() => [
        {
            id: "select",
            header: () => (
                <Checkbox
                    checked={getSelectedCount() > 0 && getSelectedCount() === studies.length}
                    onCheckedChange={(value) => {
                        if (value) {
                            selectAll(studies.map((s) => s["0020000D"]?.Value?.[0] || ""));
                        } else {
                            clearSelection();
                        }
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => {
                const studyInstanceUid = row.original["0020000D"]?.Value?.[0] || "";
                return (
                    <Checkbox
                        checked={isStudySelected(studyInstanceUid)}
                        onCheckedChange={() => toggleStudySelection(studyInstanceUid, true)}
                        aria-label="Select study"
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
                <TableThumbnailCell
                    source={{
                        type: "share",
                        token: token,
                        password: password,
                    }}
                    studyInstanceUid={row.original["0020000D"]?.Value?.[0] || ""}
                />
            ),
        },
        {
            accessorKey: "tags",
            header: "Tags",
            cell: ({ row }) => (
                <DicomDataTableTagCell
                    mode="share"
                    token={token}
                    targetType="study"
                    targetId={row.original["0020000D"]?.Value?.[0] || ""}
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
                    study={row.original}
                    token={token}
                    password={password}
                    publicPermissions={publicPermissions}
                />
            ),
        },
    ], [
        token,
        password,
        studies,
        clearSelection,
        selectAll,
        getSelectedCount,
        isStudySelected,
        toggleStudySelection,
        generalColumns,
        publicPermissions
    ]);

    const table = useReactTable({
        data: studies,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: false,
    });

    const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, study: DicomStudyData) => {
        const studyInstanceUid = study["0020000D"]?.Value?.[0] || "";
        if (e.button !== 0) return;

        const target = e.target as HTMLElement;
        if (
            target.closest('[role="checkbox"]') ||
            target.closest('[role="menuitem"]') ||
            target.closest('button')
        ) {
            return;
        }

        e.preventDefault();
        toggleStudySelection(studyInstanceUid, true);
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
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const studyInstanceUid = row.original["0020000D"]?.Value?.[0] || "";
                                const isSelected = isStudySelected(studyInstanceUid);

                                return (
                                    <SharedDicomStudyContextMenu
                                        key={row.id}
                                        token={token}
                                        password={password}
                                        studyInstanceUid={studyInstanceUid}
                                        publicPermissions={publicPermissions}
                                    >
                                        <TableRow
                                            data-dicom-card
                                            className={cn(
                                                "cursor-pointer select-none transition-colors",
                                                isSelected && "bg-accent/50"
                                            )}
                                            onClick={(e) => handleRowClick(e, row.original)}
                                            onContextMenu={() => {
                                                if (getSelectedCount() === 0) {
                                                    selectStudy(studyInstanceUid);
                                                } else if (getSelectedCount() === 1) {
                                                    clearSelection();
                                                    selectStudy(studyInstanceUid);
                                                }
                                            }}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </SharedDicomStudyContextMenu>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
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