"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
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
            toast.success("Share link deleted successfully");
            onSuccess?.();
        },
        onError: () => {
            toast.error("Failed to delete share link");
        },
    });

    const handleConfirm = () => {
        deleteShareLink(shareLinkId);
    }

    return createPortal(
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Share Link</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this share link?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>,
        document.body,
    );
}
