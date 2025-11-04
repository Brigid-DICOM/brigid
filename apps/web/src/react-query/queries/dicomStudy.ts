import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DicomStudyQueryParams {
    workspaceId: string;
    offset?: number;
    limit?: number;
}

export const getDicomStudyQuery = ({
    workspaceId,
    offset = 0,
    limit = 10
}: DicomStudyQueryParams) => queryOptions({
    queryKey: ["dicom-study", workspaceId, offset, limit],
    queryFn: async () => {
        const response = await apiClient.api.workspaces[":workspaceId"].studies.$get({
            param: {
                workspaceId,
            },
            query: {
                offset: offset.toString(),
                limit: limit.toString()
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch DICOM study instances");
        }

        if (response.status === 204) {
            return [];
        }

        return await response.json();
    }
});


