import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getEventLogsQuery = ({
    workspaceId,
    limit = 20,
    offset = 0,
    cookie,
    ...params
}: {
    workspaceId: string;
    limit?: number;
    offset?: number;
    cookie?: string;
    level?: string;
    name?: string;
    startDate?: string;
    endDate?: string;
}) =>
    queryOptions({
        queryKey: ["event-logs", workspaceId, limit, offset, params],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const res = await apiClient.api.workspaces[":workspaceId"][
                "event-logs"
            ].$get(
                {
                    param: { workspaceId },
                    query: {
                        limit: limit.toString(),
                        offset: offset.toString(),
                        ...params,
                    },
                },
                {
                    headers,
                },
            );
            if (!res.ok) throw new Error("Failed to fetch event logs");

            return await res.json();
        },
    });
