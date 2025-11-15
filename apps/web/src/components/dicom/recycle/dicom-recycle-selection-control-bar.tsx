import { Grid3x3Icon, ListIcon, Trash2Icon, UndoIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { type LayoutMode, useLayoutStore } from "@/stores/layout-store";
import { DicomDeleteConfirmDialog } from "./dicom-delete-confirm-dialog";

interface DicomRecycleSelectionControlBarProps {
    selectedCount: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onRestore: () => void;
    onDelete: () => void;
    multiRestoreLabel?: string;
    multiDeleteLabel?: string;
    dicomLevel: "study" | "series" | "instance";
}

export function DicomRecycleSelectionControlBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onClearSelection,
    onRestore,
    onDelete,
    multiRestoreLabel,
    multiDeleteLabel,
    dicomLevel,
}: DicomRecycleSelectionControlBarProps) {
    const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
    const layoutMode = useLayoutStore((state) => state.layoutMode);
    const setLayoutMode = useLayoutStore((state) => state.setLayoutMode);

    const handleLayoutChange = (mode: LayoutMode) => {
        setLayoutMode(mode);
    };

    const handleDelete = () => {
        if (selectedCount === 0) return;
        setShowDeleteConfirmDialog(true);
    }

    const handleConfirmDelete = () => {
        if (selectedCount === 0) return;
        onDelete();
    }

    return (
        <>
            <div className="flex items-center mb-6 p-4 bg-muted rounded-lg gap-6">
                <div className="flex items-center space-x-4">
                    <Button variant={"outline"} size="sm" onClick={onSelectAll}>
                        {isAllSelected ? "取消全選" : "全選"}
                    </Button>
                    {selectedCount > 0 && (
                        <Button
                            variant={"outline"}
                            size="sm"
                            onClick={onClearSelection}
                        >
                            清除選取
                        </Button>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {selectedCount > 0 && (
                        <>
                            <span className="text-sm text-gray-600">
                                已選取 {selectedCount} 筆
                            </span>

                            <Button
                                variant={"outline"}
                                size="sm"
                                onClick={onRestore}
                                className="flex items-center"
                            >
                                <UndoIcon className="size-4" />
                                <span>
                                    {multiRestoreLabel} ({selectedCount})
                                </span>
                            </Button>

                            <Button
                                variant={"destructive"}
                                size="sm"
                                onClick={handleDelete}
                                className="flex items-center"
                            >
                                <Trash2Icon className="size-4" />
                                <span>
                                    {multiDeleteLabel} ({selectedCount})
                                </span>
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-end justify-end ml-auto">
                    <Button
                        variant={layoutMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLayoutChange("grid")}
                        className="rounded-r-none border-r"
                    >
                        <Grid3x3Icon className="size-4" />
                    </Button>
                    <Button
                        variant={layoutMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleLayoutChange("list")}
                        className="rounded-l-none"
                    >
                        <ListIcon className="size-4" />
                    </Button>
                </div>
            </div>

            <DicomDeleteConfirmDialog 
                open={showDeleteConfirmDialog}
                onOpenChange={setShowDeleteConfirmDialog}
                dicomLevel={dicomLevel}
                selectedCount={selectedCount}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
