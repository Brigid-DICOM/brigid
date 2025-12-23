"use client";

import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    Loader2Icon,
    Trash2Icon,
    UploadIcon,
    XCircleIcon,
    XIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/app/_i18n/client";
import { formatFileSize } from "@/lib/utils";
import {
    type UploadStatus,
    type UploadTask,
    useUploadManagerStore,
} from "@/stores/upload-manager-store";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { UploadCloseDialog } from "./upload-close-dialog";

export function UploadTaskList() {
    const { t } = useT("translation");
    const pathname = usePathname();
    const isUploadPage = pathname.startsWith("/dicom-upload");

    const {
        tasks,
        removeTask,
        clearCompletedTasks,
        clearAllTasks,
        abortAllActiveTasks,
        getActiveTasksCount,
        getPendingTasksCount,
        getUploadingTasksCount,
        getAllTasksCount,
        hasOnlyCompletedOrFailedTasks,
    } = useUploadManagerStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);

    const handleCloseUploadList = () => {
        if (hasOnlyCompletedOrFailedTasks() || getAllTasksCount() === 0) {
            clearAllTasks();
            setIsVisible(false);
        } else {
            setShowCloseDialog(true);
        }
    };

    const handleConfirmClose = () => {
        abortAllActiveTasks();
        clearAllTasks();
        setIsVisible(false);
        setShowCloseDialog(false);
    };

    useEffect(() => {
        if (tasks.length > 0) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setShowCloseDialog(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [tasks.length]);

    const activeTasksCount = getActiveTasksCount();
    const hasActiveTasks = activeTasksCount > 0;
    const hasCompletedTasks = tasks.some(
        (task) => task.status === "completed" || task.status === "failed",
    );

    if (!isVisible || isUploadPage) return null;

    const formatDuration = (startTime: number, endTime?: number) => {
        const duration = (endTime || Date.now()) - startTime;
        const seconds = Math.floor(duration / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
        return `${minutes}m`;
    };

    const getStatusIcon = (status: UploadStatus) => {
        switch (status) {
            case "completed":
                return <CheckCircleIcon className="size-4 text-green-500" />;
            case "failed":
            case "cancelled":
                return <XCircleIcon className="size-4 text-red-500" />;
            case "uploading":
            case "pending":
                return <UploadIcon className="size-4 text-blue-500" />;
            case "validating":
                return (
                    <Loader2Icon className="size-4 text-yellow-500 animate-spin" />
                );
            default:
                return null;
        }
    };

    const getStatusText = (status: UploadTask["status"]) => {
        switch (status) {
            case "validating":
                return t("upload.status.validating");
            case "pending":
                return t("upload.status.pending");
            case "uploading":
                return t("upload.status.uploading");
            case "completed":
                return t("upload.status.completed");
            case "failed":
                return t("upload.status.failed");
            case "cancelled":
                return t("upload.status.cancelled");
            default:
                return t("upload.status.unknown");
        }
    };

    const cancelUpload = (task: UploadTask) => {
        if (task.abortController && !task.abortController.signal.aborted) {
            task.abortController.abort();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <Card className="shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 min-w-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex text-sm font-medium items-center space-x-2">
                            <UploadIcon className="size-4" />
                            <span>
                                {t("upload.uploadingTasks")} ({tasks.length})
                            </span>
                        </CardTitle>

                        <div className="flex items-center space-x-1">
                            <Button
                                variant={"ghost"}
                                size="sm"
                                onClick={handleCloseUploadList}
                                className="size-6 p-0"
                                title={t("upload.closeUploadList")}
                            >
                                <XIcon className="size-3" />
                            </Button>

                            <Button
                                variant={"ghost"}
                                size="sm"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="size-6 p-0"
                            >
                                {isExpanded ? (
                                    <ChevronDownIcon className="size-3" />
                                ) : (
                                    <ChevronUpIcon className="size-3" />
                                )}
                            </Button>

                            {hasCompletedTasks && (
                                <Button
                                    variant={"ghost"}
                                    size="sm"
                                    onClick={clearCompletedTasks}
                                    className="size-6 p-0"
                                    title={t("upload.clearCompletedTasks")}
                                >
                                    <Trash2Icon className="size-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {hasActiveTasks && (
                        <div className="text-xs text-muted-foreground">
                            {t("upload.uploading", { count: activeTasksCount })}
                            {t("upload.files")}
                        </div>
                    )}
                </CardHeader>

                {isExpanded && (
                    <CardContent className="pt-0 max-h-64 overflow-y-auto">
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div key={task.id} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                                            {getStatusIcon(task.status)}
                                            <span className="truncate font-medium">
                                                {task.filename}
                                            </span>
                                        </div>

                                        <Button
                                            variant={"ghost"}
                                            size="sm"
                                            onClick={() => {
                                                if (
                                                    task.status === "uploading"
                                                ) {
                                                    cancelUpload(task);
                                                } else {
                                                    removeTask(task.id);
                                                }
                                            }}
                                        >
                                            <XIcon className="size-3" />
                                        </Button>
                                    </div>

                                    {task.status === "uploading" ||
                                        task.status === "pending" ||
                                        (task.status === "validating" && (
                                            <Progress
                                                value={task.progress}
                                                className="h-1"
                                            />
                                        ))}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            {getStatusText(task.status)}
                                        </span>
                                        <div className="fex items-center space-x-2">
                                            <span>
                                                {formatFileSize(task.size)}
                                            </span>
                                            <span>
                                                {formatDuration(
                                                    task.startTime,
                                                    task.endTime,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {task.error && (
                                        <div className="text-xs text-destructive bg-destructive/10 p-1 rounded">
                                            {task.error}
                                        </div>
                                    )}

                                    {task.validationError && (
                                        <div className="text-xs text-destructive bg-destructive/10 p-1 rounded">
                                            {task.validationError}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-4">
                                {t("upload.noActiveTasks")}
                            </div>
                        )}
                    </CardContent>
                )}

                <UploadCloseDialog
                    open={showCloseDialog}
                    onOpenChange={setShowCloseDialog}
                    onConfirm={handleConfirmClose}
                    pendingCount={getPendingTasksCount()}
                    uploadingCount={getUploadingTasksCount()}
                />
            </Card>
        </div>
    );
}
