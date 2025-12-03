import { queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getTargetShareLinksQuery = ({
    targetType,
    targetIds,
    workspaceId,
    limit = 10,
    page = 1,
}: {
    targetType: "study" | "series" | "instance";
    targetIds: string[];
    workspaceId: string;
    limit?: number;
    page?: number;
}) => {
    return queryOptions({
        queryKey: [
            "share-links",
            workspaceId,
            targetType,
            targetIds.join(","),
            limit,
            page,
        ],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[":workspaceId"][
                "share-links"
            ][":targetType"].$get({
                param: {
                    workspaceId,
                    targetType,
                },
                query: {
                    page: page.toString(),
                    targetIds: targetIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch target share links");
            }

            return await response.json();
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!targetType && !!targetIds.length && !!workspaceId,
    });
};

export const getTargetShareLinkCountQuery = ({
    targetType,
    targetIds,
    workspaceId,
}: {
    targetType: "study" | "series" | "instance";
    targetIds: string[];
    workspaceId: string;
}) => {
    return queryOptions({
        queryKey: [
            "share-link-count",
            targetType,
            targetIds.join(","),
            workspaceId,
        ],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[":workspaceId"][
                "share-links"
            ][":targetType"].count.$get({
                param: {
                    workspaceId,
                    targetType,
                },
                query: {
                    targetIds,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch target share link count");
            }

            return await response.json();
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!targetType && !!targetIds.length && !!workspaceId,
    });
};

export const getUserShareLinksQuery = ({
    workspaceId,
    page = 1,
    limit = 10,
    cookie,
}: {
    workspaceId: string;
    page?: number;
    limit?: number;
    cookie?: string;
}) => {
    return queryOptions({
        queryKey: ["user-share-links", workspaceId, page, limit],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces[":workspaceId"][
                "share-links"
            ].$get({
                param: {
                    workspaceId,
                },
                query: {
                    page: page.toString(),
                    limit: limit.toString(),
                },
            }, {
                headers: headers
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user share links");
            }

            return await response.json();
        },
        staleTime: 5 * 60 * 1000,
        enabled: !!workspaceId,
    });
};

export const getUserReceivedShareLinksQuery = ({
    page = 1,
    limit = 10,
    cookie,
}: {
    page?: number;
    limit?: number;
    cookie?: string;
}) => {
    return queryOptions({
        queryKey: ["user-received-share-links", page, limit],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api["share-links"].received.$get({
                query: {
                    page: page.toString(),
                    limit: limit.toString(),
                }
            }, {
                headers: headers
            });


            if (!response.ok) {
                throw new Error("Failed to fetch user received share links");
            }

            return await response.json();
        },
        staleTime: 5 * 60 * 1000,
    });
};