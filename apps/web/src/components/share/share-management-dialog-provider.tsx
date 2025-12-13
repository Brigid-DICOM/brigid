"use client";

import { useShallow } from "zustand/react/shallow";
import { useShareManagementDialogStore } from "@/stores/share-management-dialog-store";
import { ShareManagementDialog } from "./share-management-dialog";

export function ShareManagementDialogProvider() {
    const {
        isOpen,
        workspaceId,
        targetType,
        targetIds,
        closeDialog
    } = useShareManagementDialogStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            workspaceId: state.workspaceId,
            targetType: state.targetType,
            targetIds: state.targetIds,
            closeDialog: state.closeDialog,
        }))
    );

    if (!workspaceId || !targetType || targetIds.length === 0) return null;

    return (
        <ShareManagementDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeDialog();
                }
            }}
            workspaceId={workspaceId}
            targetType={targetType}
            targetIds={targetIds}
        />
    )
}