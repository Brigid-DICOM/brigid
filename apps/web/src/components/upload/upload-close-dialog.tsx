"use client";

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

interface UploadCloseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    pendingCount: number;
    uploadingCount: number;
}

export function UploadCloseDialog({
    open,
    onOpenChange,
    onConfirm,
    pendingCount,
    uploadingCount,
}: UploadCloseDialogProps) {
    const { t } = useT("translation");

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("upload.closeDialog.title")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("upload.closeDialog.description", {
                            uploadingCount,
                            pendingCount,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        {t("upload.closeDialog.cancel")}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        {t("upload.closeDialog.confirm")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
