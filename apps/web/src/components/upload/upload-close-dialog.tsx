"use client";

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
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        確定關閉上傳列表嗎？
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        目前有 {uploadingCount} 個檔案正在上傳，{pendingCount}{" "}
                        個檔案等待中。關閉將會取消所有進行中的上傳。
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        取消
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>
                        確定關閉
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}