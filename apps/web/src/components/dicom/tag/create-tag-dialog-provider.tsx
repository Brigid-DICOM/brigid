import { useShallow } from "zustand/react/shallow";
import { useCreateTagDialogStore } from "@/stores/create-tag-dialog-store";
import { CreateTagDialog } from "./create-tag-dialog";

export function CreateTagDialogProvider() {
    const {
        isOpen,
        workspaceId,
        targetType,
        targetId,
        closeDialog,
    } = useCreateTagDialogStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            workspaceId: state.workspaceId,
            targetType: state.targetType,
            targetId: state.targetId,
            closeDialog: state.closeDialog,
        }))
    );

    if (!workspaceId || !targetType || !targetId) return null;

    return (
        <CreateTagDialog
            open={isOpen}
            onOpenChange={closeDialog}
            workspaceId={workspaceId}
            targetType={targetType}
            targetId={targetId}
        />
    )
}