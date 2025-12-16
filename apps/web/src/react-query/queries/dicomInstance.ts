import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomInstanceQueryParams {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    offset?: number;
    limit?: number;
    deleteStatus?: number;
    cookie?: string;
}

export const getDicomInstanceQuery = ({
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
    offset = 0,
    limit = 10,
    deleteStatus = DICOM_DELETE_STATUS.ACTIVE,
    cookie,
    ...searchConditions
}: DicomInstanceQueryParams) =>
    queryOptions({
        queryKey: [
            "dicom-instance",
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            offset,
            limit,
            deleteStatus,
            ...Object.keys(searchConditions),
        ],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].studies[":studyInstanceUid"].series[
                ":seriesInstanceUid"
            ].instances.$get(
                {
                    param: {
                        workspaceId,
                        studyInstanceUid,
                        seriesInstanceUid,
                    },
                    query: {
                        offset: offset.toString(),
                        limit: limit.toString(),
                        deleteStatus: deleteStatus.toString(),
                        ...Object.fromEntries(
                            Object.entries(searchConditions).filter(
                                ([_, value]) =>
                                    value !== undefined &&
                                    value !== null &&
                                    value !== "",
                            ),
                        ),
                    },
                },
                {
                    headers: headers,
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch DICOM instance");
            }

            if (response.status === 204) {
                return [];
            }

            return await response.json();
        },
    });

export const getDicomInstanceThumbnailQuery = (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUid: string,
    viewport: string = "64,64",
) =>
    queryOptions({
        queryKey: [
            "dicom-instance-thumbnail",
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            viewport,
        ],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].studies[":studyInstanceUid"].series[
                ":seriesInstanceUid"
            ].instances[":sopInstanceUid"].thumbnail.$get({
                header: {
                    accept: "image/jpeg",
                },
                param: {
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                    sopInstanceUid,
                },
                query: {
                    viewport,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch DICOM instance thumbnail");
            }

            return await response.blob();
        },
    });

export const recycleDicomInstanceMutation = ({
    workspaceId,
    instanceIds,
}: {
    workspaceId: string;
    instanceIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.instances.recycle.$post({
                param: {
                    workspaceId,
                },
                json: {
                    instanceIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to recycle DICOM instance");
            }

            return await response.json();
        },
    });

export const restoreDicomInstanceMutation = ({
    workspaceId,
    instanceIds,
}: {
    workspaceId: string;
    instanceIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.instances.restore.$post({
                param: {
                    workspaceId,
                },
                json: {
                    instanceIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to restore DICOM instance");
            }

            return await response.json();
        },
    });

export const deleteDicomInstanceMutation = ({
    workspaceId,
    instanceIds,
}: {
    workspaceId: string;
    instanceIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.instances.delete.$post({
                param: {
                    workspaceId,
                },
                json: {
                    instanceIds,
                },
            });

            if (!response.ok) {
                throw Error("Failed to delete DICOM instance");
            }

            return await response.json();
        },
    });
