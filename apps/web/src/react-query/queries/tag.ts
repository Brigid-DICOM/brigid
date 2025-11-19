import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";

export const getWorkspaceTagsQuery = (workspaceId: string, name?: string) =>
    queryOptions({
        queryKey: ["tags", workspaceId],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].tags.$get({
                param: {
                    workspaceId,
                },
                query: {
                    name,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch workspace tags");
            }

            return await response.json();
        },
    });

export const getTargetTagsQuery = (
    workspaceId: string,
    targetType: TagTargetType,
    targetId: string,
) =>
    queryOptions({
        queryKey: ["tags", workspaceId, targetType, targetId],
        queryFn: async () => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].tags[":targetType"][":targetId"].$get({
                param: {
                    workspaceId,
                    targetType,
                    targetId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch target tags");
            }

            return await response.json();
        },
    });

export const createTagMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            name,
            color,
        }: {
            workspaceId: string;
            name: string;
            color: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].tags.$post({
                param: {
                    workspaceId,
                },
                json: {
                    name,
                    color,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create tag");
            }

            return await response.json();
        },
    });

export const updateTagMutation = () => 
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            tagId,
            name,
            color,
        }: {
            workspaceId: string;
            tagId: string;
            name?: string;
            color?: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].tags[":tagId"].$patch({
                param: {
                    workspaceId,
                    tagId,
                },
                json: {
                    name,
                    color,
                },
            });
            
            if (!response.ok) {
                throw new Error("Failed to update tag");
            }

            return await response.json();
        },
    });

export const assignTagMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            tagId,
            targetType,
            targetId,
        }: {
            workspaceId: string;
            tagId: string;
            targetType: TagTargetType;
            targetId: string;
        }) => {
            const response = await apiClient.api.workspaces[
                ":workspaceId"
            ].tags.assign.$post({
                param: {
                    workspaceId,
                },
                json: {
                    tagId,
                    targetType,
                    targetId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to assign tag");
            }

            return await response.json();
        },
    });

export const removeTagAssignmentMutation = () =>
    mutationOptions({
        mutationFn: async ({
            workspaceId,
            assignmentId,
        }: {
            workspaceId: string;
            assignmentId: string;
        }) => {
            const response = await apiClient.api.workspaces[":workspaceId"][
                "tag-assignments"
            ][":assignmentId"].$delete({
                param: {
                    workspaceId,
                    assignmentId,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove tag assignment");
            }

            return await response.json();
        },
    });
