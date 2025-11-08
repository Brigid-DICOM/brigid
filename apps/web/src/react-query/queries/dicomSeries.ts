import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomSeriesQueryParams {
    workspaceId: string;
    studyInstanceUid: string;
    offset?: number;
    limit?: number;
}

export const getDicomSeriesQuery = ({
    workspaceId,
    studyInstanceUid,
    offset = 0,
    limit = 10,
    ...searchConditions
}: DicomSeriesQueryParams) => queryOptions({
    queryKey: ["dicom-series", workspaceId, studyInstanceUid, offset, limit],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].series.$get({
            param: {
                workspaceId,
                studyInstanceUid
            },
            query: {
                offset: offset.toString(),
                limit: limit.toString(),
                ...Object.fromEntries(
                    Object.entries(searchConditions).filter(([_, value]) =>
                        value !== undefined && value !== null && value !== ""
                    )
                )
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch DICOM series");
        }

        if (response.status === 204) {
            return [];
        }

        return await response.json();
    }
});

export const getDicomSeriesThumbnailQuery = (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    viewport: string = "64,64"
) => queryOptions({
    queryKey: ["dicom-series-thumbnail", workspaceId, studyInstanceUid, seriesInstanceUid, viewport],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].series[":seriesInstanceUid"].thumbnail.$get({
            header: {
                accept: "image/jpeg"
            },
            param: {
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid
            },
            query: {
                viewport
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch DICOM series thumbnail");
        }

        return await response.blob();
    },
    enabled: !!workspaceId && !!studyInstanceUid && !!seriesInstanceUid
});