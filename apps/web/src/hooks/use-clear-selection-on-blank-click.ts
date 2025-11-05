import { useEffect } from "react";

interface UseClearSelectionOnBlankClickProps {
    clearSelection: () => void;
    enabled?: boolean;
    dataAttribute?: string;
    excludeSelectors?: string[]; // 要排除的選擇器（點擊這些元素時不清除選取）
}

export function useClearSelectionOnBlankClick({
    clearSelection,
    enabled = true,
    dataAttribute = "data-dicom-card",
    excludeSelectors = [
        'button',
        'a',
        'input',
        'textarea',
        'select',
        '[role="menu"]',
        '[role="menuitem"]',
        '[data-radix-menu-content]', // Radix UI menu
        '[data-radix-context-menu-content]', // Radix UI context menu
        '[data-radix-dialog-content]', // Radix UI dialog
    ],
}: UseClearSelectionOnBlankClickProps) {
    useEffect(() => {
        if (!enabled) return;

        const handleDocumentClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            if (target.closest(`[${dataAttribute}]`)) {
                return;
            }

            for (const selector of excludeSelectors) {
                if (target.closest(selector)) {
                    return;
                }
            }
            
            clearSelection();
        };

        document.addEventListener('click', handleDocumentClick);

        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [clearSelection, enabled, dataAttribute, excludeSelectors]);
}