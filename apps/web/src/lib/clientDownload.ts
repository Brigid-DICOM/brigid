import { apiClient } from "@/react-query/apiClient";
import { useDownloadManagerStore } from "@/stores/download-manager-store";

export const downloadStudy = async (
    workspaceId: string,
    studyInstanceUid: string,
    filename?: string
): Promise<string> => {
    const { addDownloadTask, updateTaskProgress, updateTaskStatus, setTaskAbortController } = useDownloadManagerStore.getState();

    const taskId = addDownloadTask({
        studyInstanceUid,
        workspaceId,
        status: "pending",
        filename: filename || `study-${studyInstanceUid}.zip`,
    });

    const abortController = new AbortController();
    setTaskAbortController(taskId, abortController);

    try {
        updateTaskStatus(taskId, "downloading");

        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].$get({
            header: {
                accept: "application/zip",
            },
            param: {
                workspaceId,
                studyInstanceUid
            },
            query: {}
        }, {
            init: {
                signal: abortController.signal
            }
        });

        if (abortController.signal.aborted) {
            updateTaskStatus(taskId, "cancelled");
            return taskId;
        }

        if (!response.ok) {
            throw new Error("Failed to download study");
        }

        const contentLength = response.headers.get("content-length");
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        const reader: ReadableStreamDefaultReader<Uint8Array> | undefined = response.body?.getReader();
        if (!reader) {
            throw new Error("Failed to get reader");
        }

        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while(true) {

            if (abortController.signal.aborted) {
                reader.cancel();
                updateTaskStatus(taskId, "cancelled");
                return taskId;
            }

            const { done, value } = await reader.read();

            if (done) break;

            chunks.push(value);
            receivedLength += value.length;

            if (totalSize > 0) {
                const progress = Math.round((receivedLength / totalSize ) * 100);
                updateTaskProgress(taskId, progress);
            }
        }

        if (abortController.signal.aborted) {
            updateTaskStatus(taskId, "cancelled");
            return taskId;
        }

        const blob = new Blob(chunks as BlobPart[]);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || `study-${studyInstanceUid}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateTaskStatus(taskId, "completed");
        updateTaskProgress(taskId, 100);

        return taskId;
    } catch (error) {
        console.error("Failed to download study", error);

        if (error instanceof Error && error.name === "AbortError") {
            updateTaskStatus(taskId, "cancelled");
        } else {
            updateTaskStatus(
                taskId,
                "failed",
                error instanceof Error ? error.message : "Unknown error"
            );
        }
        throw error;
    }
}

export const downloadMultipleStudies = async (
    workspaceId: string,
    studyInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = studyInstanceUids.map((studyInstanceUid, index) => {
        const filename = `study-${index + 1}-${studyInstanceUid}.zip`;
        return downloadStudy(workspaceId, studyInstanceUid, filename);
    });

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple studies", error);
        throw error;
    }
}

export const cancelDownload = (taskId: string) => {
    const { tasks, updateTaskStatus } = useDownloadManagerStore.getState();
    const task = tasks.find(task => task.id === taskId);

    if (task?.abortController) {
        task.abortController.abort();
    }

    updateTaskStatus(taskId, "cancelled");
}