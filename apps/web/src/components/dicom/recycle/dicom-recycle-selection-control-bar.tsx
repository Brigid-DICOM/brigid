import { Grid3x3Icon, ListChecksIcon, ListIcon, Trash2Icon, UndoIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { type LayoutMode, useLayoutStore } from "@/stores/layout-store";
import { DicomDeleteConfirmDialog } from "./dicom-delete-confirm-dialog";

interface DicomRecycleSelectionControlBarProps {
    selectedCount: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onRestore: () => void;
    onDelete: () => void;
    dicomLevel: "study" | "series" | "instance";
}

export function DicomRecycleSelectionControlBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onClearSelection,
    onRestore,
    onDelete,
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
                <ButtonGroup>
                    <ButtonGroup>
                        {selectedCount > 0 && (
                            <Button
                                variant={"outline"}
                                size="sm"
                                onClick={onClearSelection}
                                title="清除選取"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        )}
                        {!isAllSelected && (
                            <Button
                                variant={"outline"}
                                size="sm"
                                onClick={onSelectAll}
                                title="全選"
                            >
                                <ListChecksIcon className="size-4" />
                            </Button>
                        )}
                        {selectedCount > 0 && (
                            <ButtonGroupText className="bg-background">
                                {selectedCount} 筆
                            </ButtonGroupText>
                        )}
                    </ButtonGroup>

                    <ButtonGroup>
                        <Button
                            variant={"outline"}
                            size="sm"
                            onClick={onRestore}
                            title="Restore"
                        >
                            <UndoIcon className="size-4" />
                        </Button>

                        <Button
                            variant={"outline"}
                            size="sm"
                            onClick={handleDelete}
                            title="Delete"
                        >
                            <Trash2Icon className="size-4 text-destructive" />
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>


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
