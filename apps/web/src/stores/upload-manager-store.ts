"use client";

import { nanoid } from "nanoid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type UploadStatus =
    | "pending"
    | "validating"
    | "uploading"
    | "completed"
    | "failed"
    | "cancelled";

export interface UploadTask {
    id: string;
    file: File;
    filename: string;
    size: number;
    status: UploadStatus;
    progress: number;
    error?: string;
    startTime: number;
    endTime?: number;
    abortController?: AbortController;
    isValid?: boolean;
    validationError?: string;
}

interface UpdateManagerState {
    tasks: UploadTask[];

    addUploadTask: (file: File) => string;
    updateTaskProgress: (id: string, progress: number) => void;
    updateTaskStatus: (
        id: string,
        status: UploadStatus,
        error?: string,
    ) => void;
    updateTaskValidation: (
        id: string,
        isValid: boolean,
        validationError?: string,
    ) => void;
    setTaskAbortController: (
        id: string,
        abortController: AbortController,
    ) => void;
    removeTask: (id: string) => void;

    clearCompletedTasks: () => void;
    clearAllTasks: () => void;
    abortAllActiveTasks: () => void;

    getActiveTasksCount: () => number;
    getCompletedTasksCount: () => number;
    getPendingTasksCount: () => number;
    getUploadingTasksCount: () => number;
    getValidatingTasksCount: () => number;
    getAllTasksCount: () => number;
    hasOnlyCompletedOrFailedTasks: () => boolean;
    getValidTasksCount: () => number;
    getInvalidTasksCount: () => number;
    getTasksByStatus: (status: UploadStatus) => UploadTask[];
}

export const useUploadManagerStore = create<UpdateManagerState>()(
    devtools(
        (set, get) => ({
            tasks: [],

            addUploadTask: (file) => {
                const taskId = nanoid(24);
                const task: UploadTask = {
                    id: taskId,
                    file,
                    filename: file.name,
                    size: file.size,
                    status: "validating",
                    progress: 0,
                    startTime: Date.now(),
                };

                set((state) => ({
                    tasks: [...state.tasks, task],
                }));

                return taskId;
            },

            updateTaskProgress: (id, progress) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, progress } : task,
                    ),
                }));
            },

            updateTaskStatus: (id, status, error) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? {
                                  ...task,
                                  status,
                                  error,
                                  endTime:
                                      status === "completed" ||
                                      status === "failed" ||
                                      status === "cancelled"
                                          ? Date.now()
                                          : task.endTime,
                              }
                            : task,
                    ),
                }));
            },

            updateTaskValidation: (id, isValid, validationError) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? {
                                  ...task,
                                  isValid,
                                  validationError,
                                  status: isValid ? "pending" : "failed",
                              }
                            : task,
                    ),
                }));
            },

            setTaskAbortController: (id, abortController) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, abortController } : task,
                    ),
                }));
            },

            removeTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));
            },

            clearCompletedTasks: () => {
                set((state) => ({
                    tasks: state.tasks.filter(
                        (task) =>
                            task.status !== "completed" &&
                            task.status !== "failed",
                    ),
                }));
            },

            clearAllTasks: () => {
                set({
                    tasks: [],
                });
            },

            abortAllActiveTasks: () => {
                const { tasks } = get();

                tasks.forEach((task) => {
                    if (task.status === "uploading" && task.abortController) {
                        if (!task.abortController.signal.aborted) {
                            task.abortController.abort();
                        }
                    }
                });

                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.status === "uploading" || task.status === "pending"
                            ? {
                                  ...task,
                                  status: "cancelled",
                              }
                            : task,
                    ),
                }));
            },

            getActiveTasksCount: () => {
                return get().tasks.filter(
                    (task) =>
                        task.status === "uploading" ||
                        task.status === "pending",
                ).length;
            },

            getPendingTasksCount: () => {
                return get().tasks.filter((task) => task.status === "pending")
                    .length;
            },

            getUploadingTasksCount: () => {
                return get().tasks.filter((task) => task.status === "uploading")
                    .length;
            },

            getValidatingTasksCount: () => {
                return get().tasks.filter(
                    (task) => task.status === "validating",
                ).length;
            },

            getCompletedTasksCount: () => {
                return get().tasks.filter((task) => task.status === "completed")
                    .length;
            },

            getAllTasksCount: () => {
                return get().tasks.length;
            },

            hasOnlyCompletedOrFailedTasks: () => {
                const { tasks } = get();
                return (
                    tasks.length > 0 &&
                    tasks.every(
                        (task) =>
                            task.status === "completed" ||
                            task.status === "failed",
                    )
                );
            },

            getValidTasksCount: () => {
                return get().tasks.filter((task) => task.isValid === true)
                    .length;
            },

            getInvalidTasksCount: () => {
                return get().tasks.filter((task) => task.isValid === false)
                    .length;
            },

            getTasksByStatus: (status) => {
                return get().tasks.filter((task) => task.status === status);
            },
        }),
        {
            name: "upload-manager-store",
        },
    ),
);
