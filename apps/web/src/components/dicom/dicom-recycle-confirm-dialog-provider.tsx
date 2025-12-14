"use client";

import { useShallow } from "zustand/react/shallow";
import { useDicomRecycleConfirmDialogStore } from "@/stores/dicom-recycle-confirm-dialog-store";
import { DicomRecycleConfirmDialog } from "./dicom-recycle-confirm-dialog";

export function DicomRecycleConfirmDialogProvider() {
    const {
        isOpen,
        dicomLevel,
        selectedCount,
        onConfirm,
        closeDialog
    } = useDicomRecycleConfirmDialogStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            dicomLevel: state.dicomLevel,
            selectedCount: state.selectedCount,
            onConfirm: state.onConfirm,
            closeDialog: state.closeDialog,
        }))
    );

    if (!dicomLevel || !onConfirm || selectedCount === 0) return null;

    return (
        <DicomRecycleConfirmDialog 
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeDialog();
                }
            }}
            dicomLevel={dicomLevel}
            selectedCount={selectedCount}
            onConfirm={onConfirm}
        />
    )
}