"use client";

import { CheckCircleIcon, ChevronDownIcon, ChevronUpIcon, DownloadIcon, FileDownIcon, Trash2Icon, XCircleIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cancelDownload } from "@/lib/clientDownload";
import { formatFileSize } from "@/lib/utils";
import { type DownloadStatus, type DownloadTask, useDownloadManagerStore } from "@/stores/download-manager-store";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { DownloadCloseDialog } from "./download-close-dialog";

export function DownloadTaskList() {
    const { 
        tasks,
        removeTask,
        clearCompletedTasks,
        clearAllTasks,
        abortAllActiveTasks,
        getActiveTasksCount,
        getPendingTasksCount,
        getDownloadingTasksCount,
        getAllTasksCount,
        hasOnlyCompletedOrFailedTasks
    } = useDownloadManagerStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);

    const handleCloseDownloadList = () => {
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
    }

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
    const hasCompletedTasks = tasks.some(task => 
        task.status === "completed" || task.status === "failed"
    );

    if (!isVisible) return null;

    const formatDuration = (startTime: number, endTime?: number) => {
        const duration = (endTime || Date.now()) - startTime;
        const seconds = Math.floor(duration / 1000);
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;

        return `${minutes}m ${seconds % 60}s`;
    }

    const getStatusIcon = (status: DownloadStatus) => {
        switch (status) {
            case "completed":
                return <CheckCircleIcon className="size-4 text-green-500" />;
            case "failed":
            case "cancelled":
                return <XCircleIcon className="size-4 text-red-500" />;
            case "downloading":
            case "pending":
                return <DownloadIcon className="size-4 text-blue-500" />;
            default:
                return null;
        }
    };

    const getStatusText = (status: DownloadTask["status"]) => {
        switch (status) {
            case "pending": return "Pending";
            case "downloading": return "Downloading";
            case "completed": return "Completed";
            case "failed": return "Failed";
            case "cancelled": return "Cancelled";
            default: return "Unknown";
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md">
            <Card className="shadow-lg border-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 min-w-md">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex text-sm font-medium items-center space-x-2">
                            <FileDownIcon className="size-4" />
                            <span>Downloading Tasks ({tasks.length})</span>
                        </CardTitle>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant={"ghost"}
                                size="sm"
                                onClick={handleCloseDownloadList}
                                className="size-6 p-0"
                                title="Close Download List"
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
                                ): (
                                    <ChevronUpIcon className="size-3" />
                                )}
                            </Button>

                            {hasCompletedTasks && (
                                <Button
                                    variant={"ghost"}
                                    size="sm"
                                    onClick={clearCompletedTasks}
                                    className="size-6 p-0"
                                    title="Clear Completed Tasks"
                                >
                                    <Trash2Icon className="size-3" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {hasActiveTasks && (
                        <div className="text-xs text-muted-foreground">
                            Downloading {activeTasksCount} files
                        </div>
                    )}
                </CardHeader>

                {isExpanded && (
                    <CardContent className="pt-0 max-h-64 overflow-y-auto">
                        <div className="space-y-3">
                            {tasks.map((task) => (
                                <div 
                                    key={task.id}
                                    className="space-y-2"
                                >
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
                                            if (task.status === "downloading") {
                                                    cancelDownload(task.id);
                                            } else {
                                                removeTask(task.id);
                                            }
                                        }}
                                        >
                                            <XIcon className="size-3" />
                                        </Button>
                                    </div>
                                    {(task.status === "downloading" || task.status === "pending") && (
                                        <Progress
                                            value={task.progress}
                                            className="h-1"
                                        />
                                    )}

                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{getStatusText(task.status)}</span>
                                        <div className="flex items-center space-x-2">
                                            {task.size && (
                                                <span>{formatFileSize(task.size)}</span>
                                            )}
                                            <span>{formatDuration(task.startTime, task.endTime)}</span>
                                        </div>
                                    </div>

                                    {task.error && (
                                        <div className="text-xs text-destructive bg-destructive/10 p-1 rounded">
                                            {task.error}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {tasks.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-4">
                                No active download tasks
                            </div>
                        )}
                    </CardContent>
                )}

                <DownloadCloseDialog 
                    open={showCloseDialog}
                    onOpenChange={setShowCloseDialog}
                    onConfirm={handleConfirmClose}
                    pendingCount={getPendingTasksCount()}
                    downloadingCount={getDownloadingTasksCount()}
                />
            </Card>
        </div>
    )
}