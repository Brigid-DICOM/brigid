import { useCallback } from "react";
import { toast } from "sonner";
import { isDicomFile } from "@/lib/dicom-validator"; 
import { useUploadManagerStore } from "@/stores/upload-manager-store";

const MAX_CONCURRENT_UPLOADS = 1;

interface UseUploadHandlerProps {
    workspaceId: string;
}

export function useUploadHandler({ workspaceId }: UseUploadHandlerProps) {
    const {
        addUploadTask,
        updateTaskProgress,
        updateTaskStatus,
        updateTaskValidation,
        setTaskAbortController,
        getTasksByStatus,
    } = useUploadManagerStore();

    const uploadFile = useCallback(
        async (taskId: string, file: File) => {
            const abortController = new AbortController();
            setTaskAbortController(taskId, abortController);

            try {
                updateTaskStatus(taskId, "uploading");

                const formData = new FormData();
                formData.append("file", file);

                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener("progress", (e) => {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        updateTaskProgress(taskId, percentComplete);
                    }
                });

                abortController.signal.addEventListener("abort", () => {
                    xhr.abort();
                    updateTaskStatus(taskId, "cancelled");
                });

                await new Promise<Response>((resolve, reject) => {
                    xhr.open("POST", `/api/workspaces/${workspaceId}/studies`);

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve(
                                new Response(xhr.response, {
                                    status: xhr.status,
                                    statusText: xhr.statusText
                                })
                            );
                        } else {
                            reject(new Error(`Upload Failed: ${xhr.statusText}`));
                        }
                    };

                    xhr.onerror = () => reject(new Error("Network Error"));
                    xhr.onabort = () => reject(new Error("Upload Cancelled"));

                    xhr.send(formData);
                });

                if (abortController.signal.aborted) {
                    return;
                }

                updateTaskStatus(taskId, "completed");
                toast.success(`Uploaded ${file.name}`, {
                    position: "bottom-center"
                });
            } catch (error) {
                if (abortController.signal.aborted) {
                    toast.info(`Upload cancelled ${file.name}`, {
                        position: "bottom-center"
                    });
                    return;
                }

                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                updateTaskStatus(taskId, "failed", errorMessage);
                toast.error(`Failed to upload ${file.name}`, {
                    position: "bottom-center"
                });
            }
        },
        [
            workspaceId,
            updateTaskProgress,
            updateTaskStatus,
            setTaskAbortController
        ]
    );

    const processQueue = useCallback(async () => {
        const pendingTasks = getTasksByStatus("pending");
        const uploadingTasks = getTasksByStatus("uploading");

        const availableSlots = MAX_CONCURRENT_UPLOADS - uploadingTasks.length;

        if (availableSlots > 0 && pendingTasks.length > 0) {
            const tasksToUpload = pendingTasks.slice(0, availableSlots);

            await Promise.all(
                tasksToUpload.map((task) => uploadFile(task.id, task.file))
            );

            processQueue();
        }
    }, [getTasksByStatus, uploadFile]);

    const addFiles = useCallback(
        async (files: File[]) => {
            if (files.length === 0) {
                toast.error("Please select at least one file to upload");
                return;
            }

            const taskIds = files.map((file) => addUploadTask(file));

            const validationResults = await Promise.all(
                files.map((file) => isDicomFile(file))
            );

            taskIds.forEach((taskIds, index) => {
                const isValid = validationResults[index];
                updateTaskValidation(
                    taskIds,
                    isValid,
                    isValid ? undefined : "Invalid DICOM file"
                )
            });

            const validCount = validationResults.filter(Boolean).length;
            const invalidCount = files.length - validCount;

            if (validCount > 0) {
                toast.success(`added ${validCount} valid files`, {
                    position: "bottom-center"
                });
            }
            if (invalidCount > 0) {
                toast.warning(`${invalidCount} invalid DICOM files were skipped`, {
                    position: "bottom-center"
                });
            }

            processQueue();
        },
        [addUploadTask, updateTaskValidation, processQueue]
    );

    return {
        addFiles
    };
}