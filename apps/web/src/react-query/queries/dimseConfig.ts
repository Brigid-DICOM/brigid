import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export interface DimseAllowedIp {
    id: string;
    ipMask: string;
    description?: string | null;
    createdAt: string;
}

export interface DimseAllowedRemote {
    id: string;
    aeTitle: string;
    host: string;
    port: number;
    description?: string | null;
    createdAt: string;
}

export interface DimseConfig {
    id: string;
    aeTitle: string;
    enabled: boolean;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
    allowedIps: DimseAllowedIp[];
    allowedRemotes: DimseAllowedRemote[];
}

export const getDimseConfigQuery = (workspaceId: string) =>
    queryOptions({
        queryKey: ["dimseConfig", workspaceId],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse.$get({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch DIMSE config");
            }

            return response.json();
        },
        enabled: !!workspaceId,
    });

export const createDimseConfigMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            aeTitle,
            enabled,
        }: {
            workspaceId: string;
            aeTitle: string;
            enabled?: boolean;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse.$post({
                param: { workspaceId },
                json: { aeTitle, enabled },
            });

            if (!response.ok) {
                throw new Error("Failed to create DIMSE config");
            }

            return response.json();
        },
    });

export const updateDimseConfigMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            aeTitle,
            enabled,
        }: {
            workspaceId: string;
            aeTitle?: string;
            enabled?: boolean;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse.$patch({
                param: { workspaceId },
                json: { aeTitle, enabled },
            });

            if (!response.ok) {
                throw new Error("Failed to update DIMSE config");
            }

            return response.json();
        },
    });

export const deleteDimseConfigMutation = () =>
    mutationOptions({
        mutationFn: async (workspaceId: string) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse.$delete({
                param: { workspaceId },
            });

            if (!response.ok) {
                throw new Error("Failed to delete DIMSE config");
            }

            return response.json();
        },
    });

export const addAllowedIpMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            ipMask,
            description,
        }: {
            workspaceId: string;
            ipMask: string;
            description?: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse["allowed-ips"].$post({
                param: { workspaceId },
                json: { ipMask, description },
            });

            if (!response.ok) {
                throw new Error("Failed to add allowed IP");
            }

            return response.json();
        },
    });

export const removeAllowedIpMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            allowedIpId,
        }: {
            workspaceId: string;
            allowedIpId: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse["allowed-ips"][":allowedIpId"].$delete({
                param: { workspaceId, allowedIpId },
            });

            if (!response.ok) {
                throw new Error("Failed to remove allowed IP");
            }

            return response.json();
        },
    });

export const addAllowedRemoteMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            aeTitle,
            host,
            port,
            description,
        }: {
            workspaceId: string;
            aeTitle: string;
            host: string;
            port: number;
            description?: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse["allowed-remotes"].$post({
                param: { workspaceId },
                json: { aeTitle, host, port, description },
            });

            if (!response.ok) {
                throw new Error("Failed to add allowed remote");
            }

            return response.json();
        },
    });

export const updateAllowedRemoteMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            remoteId,
            aeTitle,
            host,
            port,
            description,
        }: {
            workspaceId: string;
            remoteId: string;
            aeTitle?: string;
            host?: string;
            port?: number;
            description?: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse["allowed-remotes"][":remoteId"].$patch({
                param: { workspaceId, remoteId },
                json: { aeTitle, host, port, description },
            });

            if (!response.ok) {
                throw new Error("Failed to update allowed remote");
            }

            return response.json();
        },
    });

export const removeAllowedRemoteMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            remoteId,
        }: {
            workspaceId: string;
            remoteId: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].dimse["allowed-remotes"][":remoteId"].$delete({
                param: { workspaceId, remoteId },
            });

            if (!response.ok) {
                throw new Error("Failed to remove allowed remote");
            }

            return response.json();
        },
    });
