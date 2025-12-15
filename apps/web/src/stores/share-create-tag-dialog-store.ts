"use client";

import type { DicomLevel } from "@brigid/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ShareCreateTagDialogState {
    isOpen: boolean;
    token: string | null;
    targetType: DicomLevel | null;
    targetId: string | null;
    password?: string;

    // Actions
    openDialog: (params: {
        token: string;
        targetType: DicomLevel;
        targetId: string;
        password?: string;
    }) => void;
    closeDialog: () => void;
}

export const useShareCreateTagDialogStore = create<ShareCreateTagDialogState>()(
    devtools(
        (set) => ({
            isOpen: false,
            token: null,
            targetType: null,
            targetId: null,

            openDialog: ({ token, targetType, targetId, password }) => {
                set({
                    isOpen: true,
                    token,
                    targetType,
                    targetId,
                    password,
                });
            },
            
            closeDialog: () => {
                set({
                    isOpen: false,
                });

                setTimeout(() => {
                    set({
                        token: null,
                        targetType: null,
                        targetId: null,
                        password: undefined,
                    });
                }, 200);
            },
        }),
        {
            name: "share-create-tag-dialog-store",
        },
    ),
);