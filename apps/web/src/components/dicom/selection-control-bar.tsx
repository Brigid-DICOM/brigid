import { ChevronDownIcon, DownloadIcon, Grid3x3Icon, ListIcon, Trash2Icon } from "lucide-react";
import { type LayoutMode, useLayoutStore } from "@/stores/layout-store";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

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
    multiDownloadLabel: string;
    multiRecycleLabel?: string;
    downloadOptions?: DownloadOption[];
}


export function SelectionControlBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onClearSelection,
    onDownload,
    onRecycle,
    multiDownloadLabel,
    multiRecycleLabel,
    downloadOptions,
}: SelectionControlBarProps) {
    const { layoutMode, setLayoutMode } = useLayoutStore();

    const handleLayoutChange = (mode: LayoutMode) => {
        setLayoutMode(mode);
    }

    return (
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

                        <div className="flex items-center space-x-2">
                            {downloadOptions ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            size={"sm"}
                                            className="flex items-center"
                                        >
                                            <DownloadIcon className="size-4" />
                                            <span>下載 ({selectedCount})</span>
                                            <ChevronDownIcon className="size-4" />
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
                            ): (
                            <Button
                                onClick={onDownload}
                                size="sm"
                                className="flex items-center"
                            >
                                <DownloadIcon className="size-4" />
                                <span>
                                    {multiDownloadLabel} ({selectedCount})
                                </span>
                            </Button>
                            )}

                            {onRecycle && (
                                <Button
                                    onClick={onRecycle}
                                    size="sm"
                                    className="flex items-center"
                                    variant="destructive"
                                >
                                    <Trash2Icon className="size-4" />
                                    <span>
                                        {multiRecycleLabel} ({selectedCount})
                                    </span>
                                </Button>
                            )}
                        </div>
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
    );
}
