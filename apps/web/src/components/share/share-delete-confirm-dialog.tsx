"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { apiClient } from "@/react-query/apiClient";

interface ShareDeleteConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    shareLinkId: string;
    onSuccess?: () => void;
}

export function ShareDeleteConfirmDialog({
    open,
    onOpenChange,
    workspaceId,
    shareLinkId,
    onSuccess,
}: ShareDeleteConfirmDialogProps) {
    const { t } = useT("translation");
    const { mutate: deleteShareLink, isPending: isDeleting } = useMutation({
        mutationFn: async (shareLinkId: string) => {
            const response = await apiClient.api.workspaces[":workspaceId"][
                "share-links"
            ][":shareLinkId"].$delete({
                param: { workspaceId, shareLinkId },
            });

            if (!response.ok) {
                throw new Error("Failed to delete share link");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success(t("shareLink.messages.shareLinkDeleted"));
            onSuccess?.();
        },
        onError: () => {
            toast.error(t("shareLink.messages.shareLinkDeletedError"));
        },
    });

    const handleConfirm = () => {
        deleteShareLink(shareLinkId);
    }

    return createPortal(
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("shareLink.deleteConfirmDialog.title")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("shareLink.deleteConfirmDialog.description")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                                {t("common.deleting")}
                            </>
                        ) : (
                            t("common.delete")
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>,
        document.body,
    );
}
