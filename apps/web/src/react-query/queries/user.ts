import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getSearchUsersQuery = ({
    query,
    limit = 10,
    page = 1,
}: {
    query: string;
    limit?: number;
    page?: number;
}) => {
    return queryOptions({
        queryKey: ["user", "search", query, limit, page],
        queryFn: async () => {
            const response = await apiClient.api.users.search.$get({
                query: {
                    query,
                    limit: limit.toString(),
                    page: page.toString(),
                },
            });

            if (!response.ok) {
                throw new Error("Failed to search users");
            }

            return await response.json();
        },
        enabled: !!query,
        staleTime: 5 * 60 * 1000,
    });
};
