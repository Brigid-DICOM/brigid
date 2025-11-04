"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type DownloadStatus = "pending" | "downloading" | "completed" | "failed" | "cancelled";

export interface DownloadTask {
    id: string;
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid?: string;
    sopInstanceUid?: string;
    status: DownloadStatus;
    progress: number;
    filename: string;
    error?: string;
    startTime: number;
    endTime?: number;
    size?: number;
    abortController?: AbortController;
};

interface DownloadManagerState {
    tasks: DownloadTask[];

    addDownloadTask: (task: Omit<DownloadTask, "id" | "progress" | "startTime">) => string;
    updateTaskProgress: (id: string, progress: number) => void;
    updateTaskStatus: (id: string, status: DownloadStatus, error?: string) => void;
    setTaskAbortController: (id: string, abortController: AbortController) => void;
    removeTask: (id: string) => void;
    clearCompletedTasks: () => void;
    clearAllTasks: () => void;
    abortAllActiveTasks: () => void;
    getActiveTasksCount: () => number;
    getCompletedTasksCount: () => number;
    getPendingTasksCount: () => number;
    getDownloadingTasksCount: () => number;
    hasOnlyCompletedOrFailedTasks: () => boolean;
}

export const useDownloadManagerStore = create<DownloadManagerState>()(
    devtools(
        (set, get) => ({
            tasks: [],

            addDownloadTask: (taskData) => {
                const taskId = `download-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                const task: DownloadTask = {
                    ...taskData,
                    id: taskId,
                    progress: 0,
                    startTime: Date.now(),
                }

                set((state) => ({
                    tasks: [...state.tasks, task],
                }));

                return taskId;
            },

            updateTaskProgress: (id, progress) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, progress } : task
                    )
                }));
            },

            updateTaskStatus: (id, status, error) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => 
                        task.id === id ? {
                            ...task,
                            status,
                            error,
                            endTime: status === "completed" || status === "failed" ? Date.now() : task.endTime,
                        }
                        : task
                    )
                }));

            },

            setTaskAbortController: (id, abortController) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, abortController } : task
                    )
                }));
            },

            removeTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));
            },

            clearCompletedTasks: () => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.status !== "completed" && task.status !== "failed"),
                }));
            },
            
            clearAllTasks: () => {
                set({
                    tasks: [],
                });
            },

            abortAllActiveTasks: () => {
                const { tasks } = get();

                tasks.forEach(task => {
                    if (task.status === "downloading" && task.abortController) {
                        if (!task.abortController.signal.aborted) {
                            task.abortController.abort();
                        }
                    }
                });

                set((state) => ({
                    tasks: state.tasks.map(task =>
                        task.status === "downloading" ? {
                            ...task,
                            status: "cancelled",
                        } : task
                    )
                }))
            },

            getActiveTasksCount: () => {
                return get().tasks.filter(
                    (task) => task.status !== "pending" && task.status !== "downloading"
                ).length;
            },

            getPendingTasksCount: () => {
                return get().tasks.filter(
                    (task) => task.status === "pending"
                ).length;
            },

            getDownloadingTasksCount: () => {
                return get().tasks.filter(
                    (task) => task.status === "downloading"
                ).length;
            },

            getCompletedTasksCount: () => {
                return get().tasks.filter(
                    (task) => task.status === "completed"
                ).length;
            },

            hasOnlyCompletedOrFailedTasks: () => {
                const { tasks } = get();
                return tasks.length > 0 && tasks.every(task =>
                    task.status === "completed" || task.status === "failed"
                );
            }
        }),
        {
            name: "download-manager-store",
        }
    )
);