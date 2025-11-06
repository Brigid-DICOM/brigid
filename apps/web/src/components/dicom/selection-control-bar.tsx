import { DownloadIcon } from "lucide-react";
import { Button } from "../ui/button";

interface SelectionControlBarProps {
    selectedCount: number;
    isAllSelected: boolean;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onDownload: () => void;
    multiDownloadLabel: string;
}

export function SelectionControlBar({
    selectedCount,
    isAllSelected,
    onSelectAll,
    onClearSelection,
    onDownload,
    multiDownloadLabel,
}: SelectionControlBarProps) {
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
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
