"use client";

import type { ClientShareLinkData } from "@brigid/types";
import { createPortal } from "react-dom";
import { useT } from "@/app/_i18n/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ShareLinkEditForm } from "./share-link-edit-form";

interface ShareLinkEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    shareLink: ClientShareLinkData;
    workspaceId: string;
}

export function ShareLinkEditDialog({
    open,
    onOpenChange,
    shareLink,
    workspaceId,
}: ShareLinkEditDialogProps) {
    const { t } = useT("translation");

    return createPortal(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("shareLink.editDialog.title")}</DialogTitle>
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
