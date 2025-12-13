"use client";

import type { ShareTargetType } from "@brigid/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ShareManagementDialogState {
    isOpen: boolean;
    workspaceId: string | null;
    targetType: ShareTargetType | null;
    targetIds: string[];

    // Actions
    openDialog: (params: {
        workspaceId: string;
        targetType: ShareTargetType;
        targetIds: string[];
    }) => void;
    closeDialog: () => void;
}

export const useShareManagementDialogStore = create<ShareManagementDialogState>()(
    devtools(
        (set) => ({
            isOpen: false,
            workspaceId: null,
            targetType: null,
            targetIds: [],

            openDialog: ({ workspaceId, targetType, targetIds }) => {
                set({
                    isOpen: true,
                    workspaceId,
                    targetType,
                    targetIds
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
                        targetIds: []
                    });
                }, 200);
            }
        }),
        {
            name: "share-management-dialog-store"
        }
    )
)