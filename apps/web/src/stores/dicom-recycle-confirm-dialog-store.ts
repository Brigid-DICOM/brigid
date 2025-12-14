"use client";

import type { DicomLevel } from "@brigid/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DicomRecycleConfirmDialogState {
    isOpen: boolean;
    dicomLevel: DicomLevel | null;
    selectedCount: number;
    onConfirm: (() => void) | null;

    openDialog: (params: {
        dicomLevel: DicomLevel;
        selectedCount: number;
        onConfirm: () => void;
    }) => void;
    closeDialog: () => void;
}

export const useDicomRecycleConfirmDialogStore = create<DicomRecycleConfirmDialogState>()(
    devtools((set) => ({
        isOpen: false,
        dicomLevel: null,
        selectedCount: 0,
        onConfirm: null,

        openDialog: ({ dicomLevel, selectedCount, onConfirm }) => {
            set({
                isOpen: true,
                dicomLevel,
                selectedCount,
                onConfirm,
            });
        },

        closeDialog: () => {
            set({
                isOpen: false
            });

            setTimeout(() => {
                set({
                    dicomLevel: null,
                    selectedCount: 0,
                    onConfirm: null,
                });
            }, 200);
        }
    }),
    {
        name: "dicom-recycle-confirm-dialog-store"
    }
));