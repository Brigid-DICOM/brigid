import { apiClient } from "@/react-query/apiClient";
import { useDownloadManagerStore } from "@/stores/download-manager-store";

interface DownloadConfig {
    taskParams: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid?: string;
        sopInstanceUid?: string;
    };
    defaultFilename: string;
    apiRequest: (abortController: AbortController) => Promise<Response>;
    errorMessage: string;
}

const downloadDicomResource = async (
    config: DownloadConfig,
    filename?: string,
): Promise<string> => {
    const {
        addDownloadTask,
        updateTaskProgress,
        updateTaskStatus,
        setTaskAbortController,
    } = useDownloadManagerStore.getState();

    const taskId = addDownloadTask({
        ...config.taskParams,
        status: "pending",
        filename: filename || config.defaultFilename,
    });

    const abortController = new AbortController();
    setTaskAbortController(taskId, abortController);

    try {
        updateTaskStatus(taskId, "downloading");

        const response = await config.apiRequest(abortController);

        if (abortController.signal.aborted) {
            updateTaskStatus(taskId, "cancelled");
            return taskId;
        }

        if (!response.ok) {
            throw new Error(config.errorMessage);
        }

        const contentLength = response.headers.get("content-length");
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        const reader: ReadableStreamDefaultReader<Uint8Array> | undefined =
            response.body?.getReader();
        if (!reader) {
            throw new Error("Failed to get reader");
        }

        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
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
                const progress = Math.round((receivedLength / totalSize) * 100);
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
        a.download = filename || config.defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        updateTaskStatus(taskId, "completed");
        updateTaskProgress(taskId, 100);

        return taskId;
    } catch (error) {
        console.error("Failed to download dicom resource", error);

        if (error instanceof Error && error.name === "AbortError") {
            updateTaskStatus(taskId, "cancelled");
        } else {
            updateTaskStatus(
                taskId,
                "failed",
                error instanceof Error ? error.message : "Unknown error",
            );
        }
        throw error;
    }
};

export const downloadStudy = async (
    workspaceId: string,
    studyInstanceUid: string,
    filename?: string,
): Promise<string> => {
    const config: DownloadConfig = {
        taskParams: {
            workspaceId,
            studyInstanceUid,
        },
        defaultFilename: filename || `study-${studyInstanceUid}.zip`,
        apiRequest: (abortController) =>
            apiClient.api.workspaces[":workspaceId"].studies[
                ":studyInstanceUid"
            ].$get(
                {
                    header: {
                        accept: "application/zip",
                    },
                    param: {
                        workspaceId,
                        studyInstanceUid,
                    },
                    query: {},
                },
                {
                    init: {
                        signal: abortController.signal,
                    },
                },
            ),
        errorMessage: "Failed to download study",
    };

    return downloadDicomResource(config, filename);
};

export const downloadMultipleStudies = async (
    workspaceId: string,
    studyInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = studyInstanceUids.map(
        (studyInstanceUid, index) => {
            const filename = `study-${index + 1}-${studyInstanceUid}.zip`;
            return downloadStudy(workspaceId, studyInstanceUid, filename);
        },
    );

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple studies", error);
        throw error;
    }
};

export const downloadSeries = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    filename?: string,
): Promise<string> => {
    const config: DownloadConfig = {
        taskParams: {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
        },
        defaultFilename: filename || `series-${seriesInstanceUid}.zip`,
        apiRequest: (abortController) =>
            apiClient.api.workspaces[":workspaceId"].studies[
                ":studyInstanceUid"
            ].series[":seriesInstanceUid"].$get(
                {
                    header: {
                        accept: "application/zip",
                    },
                    param: {
                        workspaceId,
                        studyInstanceUid,
                        seriesInstanceUid,
                    },
                    query: {},
                },
                {
                    init: {
                        signal: abortController.signal,
                    },
                },
            ),
        errorMessage: "Failed to download series",
    };

    return downloadDicomResource(config, filename);
};

export const downloadMultipleSeries = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = seriesInstanceUids.map(
        (seriesInstanceUid, index) => {
            const filename = `series-${index + 1}-${seriesInstanceUid}.zip`;
            return downloadSeries(
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                filename,
            );
        },
    );

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple series", error);
        throw error;
    }
};

export const downloadInstance = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUid: string,
    filename?: string,
): Promise<string> => {
    const config: DownloadConfig = {
        taskParams: {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        },
        defaultFilename: filename || `instance-${sopInstanceUid}.dcm`,
        apiRequest: (abortController) =>
            apiClient.api.workspaces[":workspaceId"]["wado-uri"].$get(
                {
                    param: {
                        workspaceId,
                    },
                    query: {
                        studyUID: studyInstanceUid,
                        seriesUID: seriesInstanceUid,
                        objectUID: sopInstanceUid,
                        requestType: "WADO",
                        contentType: "application/dicom",
                    },
                },
                {
                    init: {
                        signal: abortController.signal,
                    },
                },
            ),
        errorMessage: "Failed to download instance",
    };
    return downloadDicomResource(config, filename);
};

export const downloadInstanceAsJpg = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUid: string,
    filename?: string,
): Promise<string> => {
    const config: DownloadConfig = {
        taskParams: {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        },
        defaultFilename: filename || `instance-${sopInstanceUid}.jpg`,
        apiRequest: (abortController) =>
            apiClient.api.workspaces[":workspaceId"]["wado-uri"].$get(
                {
                    param: {
                        workspaceId,
                    },
                    query: {
                        studyUID: studyInstanceUid,
                        seriesUID: seriesInstanceUid,
                        objectUID: sopInstanceUid,
                        requestType: "WADO",
                        contentType: "image/jpeg",
                    },
                },
                {
                    init: {
                        signal: abortController.signal,
                    },
                },
            ),
        errorMessage: "Failed to download instance as jpg",
    };
    return downloadDicomResource(config, filename);
};

export const downloadInstanceAsPng = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUid: string,
    filename?: string,
): Promise<string> => {
    const config: DownloadConfig = {
        taskParams: {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        },
        defaultFilename: filename || `instance-${sopInstanceUid}.png`,
        apiRequest: (abortController) =>
            apiClient.api.workspaces[":workspaceId"]["wado-uri"].$get(
                {
                    param: {
                        workspaceId,
                    },
                    query: {
                        studyUID: studyInstanceUid,
                        seriesUID: seriesInstanceUid,
                        objectUID: sopInstanceUid,
                        requestType: "WADO",
                        contentType: "image/png",
                    },
                },
                {
                    init: {
                        signal: abortController.signal,
                    },
                },
            ),
        errorMessage: "Failed to download instance as png",
    };
    return downloadDicomResource(config, filename);
};

export const downloadMultipleInstances = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = sopInstanceUids.map((sopInstanceUid, index) => {
        const filename = `instance-${index + 1}-${sopInstanceUid}.dcm`;
        return downloadInstance(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            filename,
        );
    });

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple instances", error);
        throw error;
    }
};

export const downloadMultipleInstancesAsJpg = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = sopInstanceUids.map((sopInstanceUid, index) => {
        const filename = `instance-${index + 1}-${sopInstanceUid}.jpg`;
        return downloadInstanceAsJpg(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            filename,
        );
    });

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple instances as jpg", error);
        throw error;
    }
};

export const downloadMultipleInstancesAsPng = async (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUids: string[],
): Promise<string[]> => {
    const downloadPromises = sopInstanceUids.map((sopInstanceUid, index) => {
        const filename = `instance-${index + 1}-${sopInstanceUid}.png`;
        return downloadInstanceAsPng(
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            filename,
        );
    });

    try {
        return await Promise.all(downloadPromises);
    } catch (error) {
        console.error("Failed to download multiple instances as png", error);
        throw error;
    }
};

export const cancelDownload = (taskId: string) => {
    const { tasks, updateTaskStatus } = useDownloadManagerStore.getState();
    const task = tasks.find((task) => task.id === taskId);

    if (task?.abortController) {
        task.abortController.abort();
    }

    updateTaskStatus(taskId, "cancelled");
};
