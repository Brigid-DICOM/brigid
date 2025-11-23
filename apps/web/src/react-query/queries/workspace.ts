import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getDefaultWorkspaceQuery = (cookie?: string) => {
    const headers: HeadersInit = {};
    if (typeof window === "undefined" && typeof cookie === "string") {
        headers.cookie = cookie;
    }

    return queryOptions({
        queryKey: ["workspace", "default"],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces.default.$get({}, {
                headers: headers
            });

            if (!response.ok) {
                throw new Error("Failed to fetch default workspace");
            }

            return response.json();
        }
    });
}