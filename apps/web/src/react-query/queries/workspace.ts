import { mutationOptions, queryOptions } from "@tanstack/react-query";
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

            const response = await apiClient.api.workspaces.default.$get(
                {},
                {
                    headers,
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch default workspace");
            }

            return response.json();
        },
    });
};

export const getWorkspaceByIdQuery = (workspaceId: string, cookie?: string) => {
    const headers: HeadersInit = {};
    if (typeof window === "undefined" && typeof cookie === "string") {
        headers.cookie = cookie;
    }

    return queryOptions({
        queryKey: ["workspace", workspaceId],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].$get(
                {
                    param: { workspaceId },
                },
                { headers },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch workspace");
            }

            return response.json();
        },
        enabled: !!workspaceId,
    });
};

export const getWorkspacesQuery = (cookie?: string) => {
    return queryOptions({
        queryKey: ["workspaces"],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces.$get(
                {},
                {
                    headers,
                },
            );

            if (!response.ok) {
                throw new Error("Failed to fetch workspaces");
            }

            return response.json();
        },
    });
};

export const setDefaultWorkspaceMutation = () =>
    mutationOptions({
        mutationFn: async (workspaceId: string) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].default.$put({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to set default workspace");
            }

            return response.json();
        },
    });

export const createWorkspaceMutation = () =>
    mutationOptions({
        mutationFn: async (name: string) => {
            const response = await apiClient.api.workspaces.$post({
                json: {
                    name,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create workspace");
            }

            return response.json();
        },
    });

export const updateWorkspaceMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            name,
        }: {
            workspaceId: string;
            name: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].$patch({
                param: { workspaceId },
                json: { name },
            });

            if (!response.ok) {
                throw new Error("Failed to update workspace");
            }

            return response.json();
        },
    });

export const deleteWorkspaceMutation = () =>
    mutationOptions({
        mutationFn: async (workspaceId: string) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].$delete({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to delete workspace");
            }

            return response.json();
        },
    });

export const addWorkspaceMembersMutation = () => {
    return mutationOptions({
        mutationFn: async ({
            workspaceId,
            users,
        }: {
            workspaceId: string;
            users: { userId: string; role: string }[];
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].members.$post({
                param: { workspaceId },
                json: { users },
            });

            if (!response.ok) {
                throw new Error("Failed to add workspace members");
            }

            return response.json();
        },
    });
};

export const getWorkspaceMembersQuery = (
    workspaceId: string,
    cookie?: string,
) => {
    return queryOptions({
        queryKey: ["workspace", workspaceId, "members"],
        queryFn: async () => {
            const headers: HeadersInit = {};
            if (typeof window === "undefined" && typeof cookie === "string") {
                headers.cookie = cookie;
            }

            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].members.$get({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace members");
            }

            return response.json();
        },
        enabled: !!workspaceId,
    });
};

export const updateWorkspaceMembersMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            users,
        }: {
            workspaceId: string;
            users: { userId: string; role: string }[];
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].members.batch.$patch({
                param: { workspaceId },
                json: { users },
            });

            if (!response.ok) {
                throw new Error("Failed to update workspace members");
            }

            return response.json();
        },
    });

export const removeWorkspaceMembersMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            userIds,
        }: {
            workspaceId: string;
            userIds: string[];
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].members["batch-delete"].$post({
                param: { workspaceId },
                json: { userIds },
            });

            if (!response.ok) {
                throw new Error("Failed to remove workspace members");
            }

            return response.json();
        },
    });

export const leaveWorkspaceMutation = () =>
    mutationOptions({
        mutationFn: async (workspaceId: string) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].members.leave.$delete({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to leave workspace");
            }

            return response.json();
        },
    });
