"use client";

import { AlertTriangleIcon, DownloadIcon, XIcon } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface DownloadCloseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    pendingCount: number;
    downloadingCount: number;
}

export function DownloadCloseDialog({
    open,
    onOpenChange,
    onConfirm,
    pendingCount,
    downloadingCount,
}: DownloadCloseDialogProps) {
    const totalActiveTasks = pendingCount + downloadingCount;

    const getDialogContent = () => {
        if (downloadingCount > 0 && pendingCount > 0) {
            return {
                title: "Cancel All Downloads?",
                description: `You have ${downloadingCount} downloading and ${pendingCount} pending downloads. All active downloads will be cancelled.`,
                icon: <AlertTriangleIcon className="size-5 text-amber-500" />,
                confirmText: "Cancel All Downloads",
            };
        } else if (downloadingCount > 0) {
            return {
                title: "Cancel Active Downloads?",
                description: `You have ${downloadingCount} active download${downloadingCount > 1 ? "s" : ""}. ${downloadingCount > 1 ? "These downloads" : "This download"} will be cancelled.`,
                icon: <DownloadIcon className="size-5 text-blue-500" />,
                confirmText: "Cancel Downloads",
            };
        } else if (pendingCount > 0) {
            return {
                title: "Clear Pending Tasks?",
                description: `You have ${pendingCount} pending task${pendingCount > 1 ? "s" : ""} that haven't started yet. ${pendingCount > 1 ? "These tasks" : "This task"} will be removed.`,
                icon: <XIcon className="size-5 text-gray-500" />,
                confirmText: "Clear Tasks",
            };
        } else {
            return {
                title: "Close Downloads",
                description:
                    "All tasks are completed. The download list will be cleared.",
                icon: <DownloadIcon className="size-5 text-green-500" />,
                confirmText: "Clear List",
            };
        }
    };

    const content = getDialogContent();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        {content.icon}
                        <span>{content.title}</span>
                    </DialogTitle>
                    <DialogDescription className="text-left">
                        {content.description}
                    </DialogDescription>
                </DialogHeader>

                {totalActiveTasks > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <AlertTriangleIcon className="size-4 text-amber-600 mt-0.5 shrink-0" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium">Warning:</p>
                                <p>
                                    {downloadingCount > 0 &&
                                        "Active downloads will be interrupted and may result in incomplete files. "}
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter className="flex space-x-2">
                    <Button
                        value={"outline"}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={
                            totalActiveTasks > 0 ? "destructive" : "default"
                        }
                        onClick={() => {
                            onConfirm();
                            onOpenChange(false);
                        }}
                    >
                        {content.confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
