"use client";

import { createPortal } from "react-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ShareLinkEditForm,
    type ShareLinkFormData,
} from "./share-link-edit-form";

interface ShareLinkEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shareLink: ShareLinkFormData;
    workspaceId: string;
}

export function ShareLinkEditDialog({
    open,
    onOpenChange,
    shareLink,
    workspaceId,
}: ShareLinkEditDialogProps) {
    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Share Link</DialogTitle>
                </DialogHeader>
                <ShareLinkEditForm
                    shareLink={shareLink}
                    workspaceId={workspaceId}
                    onSuccess={() => onOpenChange(false)}
                    onCancel={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>,
        document.body,
    );
}
