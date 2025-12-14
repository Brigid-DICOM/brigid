"use client";

import type { DicomLevel } from "@brigid/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface CreateTagDialogState {
    isOpen: boolean;
    workspaceId: string | null;
    targetType: DicomLevel | null;
    targetId: string | null;

    // Actions
    openDialog: (params: {
        workspaceId: string;
        targetType: DicomLevel;
        targetId: string;
    }) => void;
    closeDialog: () => void;
}

export const useCreateTagDialogStore = create<CreateTagDialogState>()(
    devtools(
        (set) => ({
            isOpen: false,
            workspaceId: null,
            targetType: null,
            targetId: null,

            openDialog: ({ workspaceId, targetType, targetId }) => {
                set({
                    isOpen: true,
                    workspaceId,
                    targetType,
                    targetId,
                });
            },

            closeDialog: () => {
                set({
                    isOpen: false,
                });

                setTimeout(() => {
                    set({
                        workspaceId: null,
                        targetType: null,
                        targetId: null,
                    });
                }, 200);
            },
        }),
        {
            name: "create-tag-dialog-store",
        },
    ),
);
