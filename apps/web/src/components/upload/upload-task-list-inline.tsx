"use client";

import {
    CheckCircleIcon,
    Loader2Icon,
    Trash2Icon,
    UploadIcon,
    XCircleIcon,
    XIcon,
} from "lucide-react";
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
import { ScrollArea } from "../ui/scroll-area";

export function UploadTaskListInLine() {
    const { t } = useT("translation");
    const {
        tasks,
        removeTask,
        clearCompletedTasks,
        getActiveTasksCount,
        getValidTasksCount,
        getInvalidTasksCount,
    } = useUploadManagerStore();

    if (tasks.length === 0) return null;

    const activeTasksCount = getActiveTasksCount();
    const validCount = getValidTasksCount();
    const invalidCount = getInvalidTasksCount();
    const hasCompletedTasks = tasks.some(
        (task) => task.status === "completed" || task.status === "failed",
    );

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
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex text-sm font-medium items-center space-x-2">
                        <UploadIcon className="size-4" />
                        <span>
                            {t("upload.uploadingTasks")} ({tasks.length})
                        </span>
                    </CardTitle>

                    {hasCompletedTasks && (
                        <Button
                            variant={"ghost"}
                            size="sm"
                            onClick={clearCompletedTasks}
                            className="h-8"
                        >
                            <Trash2Icon className="size-3 mr-1" />
                            {t("upload.clearCompleted")}
                        </Button>
                    )}
                </div>

                <div className="flex gap-4 text-xs text-muted-foreground">
                    {activeTasksCount > 0 && (
                        <span>
                            {t("upload.uploading")} {activeTasksCount}
                        </span>
                    )}
                    {validCount > 0 && (
                        <span className="text-green-600">
                            {t("upload.valid")} {validCount}
                        </span>
                    )}
                    {invalidCount > 0 && (
                        <span className="text-destructive">
                            {t("upload.invalid")} {invalidCount}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className="space-y-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        {getStatusIcon(task.status)}
                                        <span className="truncate font-medium">
                                            {task.filename}
                                        </span>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (task.status === "uploading") {
                                                cancelUpload(task);
                                            } else {
                                                removeTask(task.id);
                                            }
                                        }}
                                    >
                                        <XIcon className="size-3" />
                                    </Button>
                                </div>

                                {(task.status === "uploading" ||
                                    task.status === "pending" ||
                                    task.status === "validating") && (
                                    <Progress
                                        value={task.progress}
                                        className="h-1.5"
                                    />
                                )}

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>{getStatusText(task.status)}</span>
                                    <div className="flex items-center space-x-2">
                                        <span>{formatFileSize(task.size)}</span>
                                        <span>
                                            {formatDuration(
                                                task.startTime,
                                                task.endTime,
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {task.error && (
                                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                                        {task.error}
                                    </div>
                                )}

                                {task.validationError && (
                                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                                        {task.validationError}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
