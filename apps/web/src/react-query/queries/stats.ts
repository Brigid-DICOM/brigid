import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

interface GetDicomStatsQueryParams {
    workspaceId: string;
    range?: string;
    cookie?: string;
}

export const getDicomStatsQuery = ({
    workspaceId,
    range,
    cookie,
}: GetDicomStatsQueryParams) => {
    return queryOptions({
        queryKey: ["stats", "dicom", workspaceId],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dicom.stats.$get(
                {
                    param: {
                        workspaceId,
                    },
                    query: {
                        range,
                    },
                },
                {
                    headers: headers,
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch DICOM stats");
            }

            return response.json();
        },
    });
};
