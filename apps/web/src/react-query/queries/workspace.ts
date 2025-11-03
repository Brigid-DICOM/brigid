import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getDefaultWorkspaceQuery = () => {
    return queryOptions({
        queryKey: ["workspace", "default"],
        queryFn: async () => {
            const response = await apiClient.api.workspaces.default.$get();

            if (!response.ok) {
                throw new Error("Failed to fetch default workspace");
            }

            return response.json();
        }
    });
}