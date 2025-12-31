import {
    DownloadIcon,
    Grid3x3Icon,
    ListChecksIcon,
    ListIcon,
    Trash2Icon,
    XIcon,
} from "lucide-react";
import { useState } from "react";
import { useT } from "@/app/_i18n/client";
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group";
import { type LayoutMode, useLayoutStore } from "@/stores/layout-store";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";

interface DownloadOption {
    label: string;
    onClick: () => void;
}

interface SelectionControlBarProps {
    selectedCount: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onDownload?: () => void;
    onRecycle?: () => void;
    downloadOptions?: DownloadOption[];
    dicomLevel: "study" | "series" | "instance";
}

export function SelectionControlBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onClearSelection,
    onDownload,
    onRecycle,
    downloadOptions,
    dicomLevel,
}: SelectionControlBarProps) {
    const { t } = useT("translation");
    const [showRecycleConfirmDialog, setShowRecycleConfirmDialog] =
        useState(false);
    const layoutMode = useLayoutStore((state) => state.layoutMode);
    const { setLayoutMode } = useLayoutStore();

    const handleLayoutChange = (mode: LayoutMode) => {
        setLayoutMode(mode);
    };

    const handleRecycle = () => {
        if (selectedCount === 0) return;

        setShowRecycleConfirmDialog(true);
    };

    const handleConfirmRecycle = () => {
        if (selectedCount === 0) return;
        onRecycle?.();
    };

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
                                title={t(
                                    "dicom.selectionControl.clearSelection",
                                )}
                            >
                                <XIcon className="size-4" />
                            </Button>
                        )}
                        {!isAllSelected && (
                            <Button
                                variant={"outline"}
                                size="sm"
                                onClick={onSelectAll}
                                title={t("dicom.selectionControl.selectAll")}
                            >
                                <ListChecksIcon className="size-4" />
                            </Button>
                        )}
                        {selectedCount > 0 && (
                            <ButtonGroupText className="bg-background">
                                {t("dicom.selectionControl.selectedCount", {
                                    count: selectedCount,
                                })}
                            </ButtonGroupText>
                        )}
                    </ButtonGroup>

                    <ButtonGroup>
                        {selectedCount > 0 && (
                            <>
                                {downloadOptions ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size={"sm"}
                                                variant={"outline"}
                                                title={t(
                                                    "dicom.selectionControl.download",
                                                )}
                                            >
                                                <DownloadIcon className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            {downloadOptions.map((option) => (
                                                <DropdownMenuItem
                                                    key={option.label}
                                                    onClick={option.onClick}
                                                >
                                                    {option.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Button
                                        onClick={onDownload}
                                        size="sm"
                                        variant={"outline"}
                                        title={t(
                                            "dicom.selectionControl.download",
                                        )}
                                    >
                                        <DownloadIcon className="size-4" />
                                    </Button>
                                )}

                                {onRecycle && (
                                    <Button
                                        onClick={handleRecycle}
                                        size="sm"
                                        variant={"outline"}
                                        title={t(
                                            "dicom.selectionControl.recycle",
                                        )}
                                    >
                                        <Trash2Icon className="size-4 text-destructive" />
                                    </Button>
                                )}
                            </>
                        )}
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

            <DicomRecycleConfirmDialog
                open={showRecycleConfirmDialog}
                onOpenChange={setShowRecycleConfirmDialog}
                dicomLevel={dicomLevel}
                selectedCount={selectedCount}
                onConfirm={handleConfirmRecycle}
            />
        </>
    );
}
