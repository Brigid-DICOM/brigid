import { useCallback } from "react";

interface UseCardSelectionProps {
    itemId: string;
    isSelected: boolean;
    toggleSelection: (id: string, ctrlKey?: boolean) => void;
    selectItem: (id: string) => void;
    clearSelection: () => void;
    onDoubleClick?: () => void;
}

export function useDicomCardSelection({
    itemId,
    isSelected,
    toggleSelection,
    selectItem,
    clearSelection,
    onDoubleClick,
}: UseCardSelectionProps) {
    const handleCardClick = useCallback(
        (event: React.MouseEvent) => {
            if (event.button !== 0) return;
            event.preventDefault();
            const ctrlKey = event.ctrlKey || event.metaKey;
            toggleSelection(itemId, ctrlKey);
        },
        [toggleSelection, itemId],
    );

    const handleContextMenu = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const ctrlKey = event.ctrlKey || event.metaKey;
            if (!isSelected) {
                if (ctrlKey) {
                    selectItem(itemId);
                } else {
                    clearSelection();
                    selectItem(itemId);
                }
            }
        },
        [isSelected, selectItem, clearSelection, itemId],
    );

    const handleDoubleClick = useCallback(
        (event: React.MouseEvent) => {
            if (onDoubleClick) {
                event.preventDefault();
                event.stopPropagation();
                onDoubleClick();
            }
        },
        [onDoubleClick],
    );

    return {
        handleCardClick,
        handleContextMenu,
        handleDoubleClick,
    };
}
