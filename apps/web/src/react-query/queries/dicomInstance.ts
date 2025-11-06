import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomInstanceQueryParams {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    offset?: number;
    limit?: number;
}

export const getDicomInstanceQuery = ({
    workspaceId,
    studyInstanceUid,
    seriesInstanceUid,
    offset = 0,
    limit = 10
}: DicomInstanceQueryParams) => queryOptions({
    queryKey: ["dicom-instance", workspaceId, studyInstanceUid, seriesInstanceUid, offset, limit],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].series[":seriesInstanceUid"].instances.$get({
            param: {
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid
            },
            query: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        });
        
        if (!response.ok) {
            throw new Error("Failed to fetch DICOM instance");
        }

        if (response.status === 204) {
            return [];
        }

        return await response.json();
    }
});

export const getDicomInstanceThumbnailQuery = (
    workspaceId: string,
    studyInstanceUid: string,
    seriesInstanceUid: string,
    sopInstanceUid: string,
    viewport: string = "64,64"
) => queryOptions({
    queryKey: ["dicom-instance-thumbnail", workspaceId, studyInstanceUid, seriesInstanceUid, sopInstanceUid, viewport],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies[":studyInstanceUid"].series[":seriesInstanceUid"].instances[":sopInstanceUid"].thumbnail.$get({
            header: {
                accept: "image/jpeg"
            },
            param: {
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid
            },
            query: {
                viewport
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch DICOM instance thumbnail");
        }

        return await response.blob();
    }
});
