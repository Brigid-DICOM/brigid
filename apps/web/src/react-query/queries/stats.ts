import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getDicomStatsQuery = (workspaceId: string, range?: string) => {
    return queryOptions({
        queryKey: ["stats", "dicom", workspaceId],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[":workspaceId"].dicom.stats.$get({
                param: {
                    workspaceId
                },
                query: {
                    range
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch DICOM stats");
            }

            return response.json();
        }
    });
};