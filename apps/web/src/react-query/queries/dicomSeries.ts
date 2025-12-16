import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomSeriesQueryParams {
    workspaceId: string;
    studyInstanceUid: string;
    offset?: number;
    limit?: number;
    deleteStatus?: number;
    cookie?: string;
}

export const getDicomSeriesQuery = ({
    workspaceId,
    studyInstanceUid,
    offset = 0,
    limit = 10,
    deleteStatus = DICOM_DELETE_STATUS.ACTIVE,
    cookie,
    ...searchConditions
}: DicomSeriesQueryParams) =>
    queryOptions({
        queryKey: [
            "dicom-series",
            workspaceId,
            studyInstanceUid,
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
            ].studies[":studyInstanceUid"].series.$get(
                {
                    param: {
                        workspaceId,
                        studyInstanceUid,
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
                throw new Error("Failed to fetch DICOM series");
            }

            if (response.status === 204) {
                return [];
            }

            return await response.json();
        },
    });

export const getDicomSeriesThumbnailQuery = (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    viewport: string = "64,64",
) =>
    queryOptions({
        queryKey: [
            "dicom-series-thumbnail",
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            viewport,
        ],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].studies[":studyInstanceUid"].series[
                ":seriesInstanceUid"
            ].thumbnail.$get({
                header: {
                    accept: "image/jpeg",
                },
                param: {
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                },
                query: {
                    viewport,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch DICOM series thumbnail");
            }

            return await response.blob();
        },
        enabled: !!workspaceId && !!studyInstanceUid && !!seriesInstanceUid,
    });

export const recycleDicomSeriesMutation = ({
    workspaceId,
    seriesIds,
}: {
    workspaceId: string;
    seriesIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.series.recycle.$post({
                param: {
                    workspaceId,
                },
                json: {
                    seriesIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to recycle DICOM series");
            }

            return await response.json();
        },
    });

export const restoreDicomSeriesMutation = ({
    workspaceId,
    seriesIds,
}: {
    workspaceId: string;
    seriesIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.series.restore.$post({
                param: {
                    workspaceId,
                },
                json: {
                    seriesIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to restore DICOM series");
            }

            return await response.json();
        },
    });

export const deleteDicomSeriesMutation = ({
    workspaceId,
    seriesIds,
}: {
    workspaceId: string;
    seriesIds: string[];
}) =>
    mutationOptions({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.series.delete.$post({
                param: {
                    workspaceId,
                },
                json: {
                    seriesIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete DICOM series");
            }

            return await response.json();
        },
    });
