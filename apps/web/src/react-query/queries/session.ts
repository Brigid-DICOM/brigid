import type { Session } from "@auth/core/types";
import { queryOptions } from "@tanstack/react-query";
import { getBaseUrl } from "../apiClient";

export const authSessionQuery = (cookie?: string) => {
    const headers: HeadersInit = {};
    if (typeof window === "undefined" && typeof cookie === "string") {
        headers.cookie = cookie;
    }

    return queryOptions({
        queryKey: ["auth", "session"],
        queryFn: async () => {
            const response = await fetch(
                `${getBaseUrl()}/api/auth/session`,
                {
                    headers,
                },
            );

            return response.json() as Promise<Session | null>;
        },
    });
};
