import { useShallow } from "zustand/react/shallow";
import { useShareCreateTagDialogStore } from "@/stores/share-create-tag-dialog-store";
import { ShareCreateTagDialog } from "./share-create-tag-dialog";

export function ShareCreateTagDialogProvider() {
    const {
        isOpen,
        token,
        targetType,
        targetId,
        password,
        closeDialog,
    } = useShareCreateTagDialogStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
            token: state.token,
            targetType: state.targetType,
            targetId: state.targetId,
            password: state.password,
            closeDialog: state.closeDialog,
        }))
    );

    if (!token || !targetType || !targetId) return null;

    return (
        <ShareCreateTagDialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    closeDialog();
                }
            }}
            token={token}
            targetType={targetType}
            targetId={targetId}
            password={password}
        />
    )
}