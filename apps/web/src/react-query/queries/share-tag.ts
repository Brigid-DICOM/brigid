import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { mutationOptions, queryOptions } from "@tanstack/react-query";
import { apiClient } from "../apiClient";


export const getTargetShareTagsQuery = (token: string, targetType: TagTargetType, targetId: string, password?: string) =>
    queryOptions({
        queryKey: ["share-tags", token, targetType, targetId],
        queryFn: async () => {
            const response = await apiClient.api.share[":token"].tags[":targetType"][":targetId"].$get({
                param: { 
                    token,
                    targetType,
                    targetId,
                },
                query: {
                    password: password ?? undefined,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch target share tags");
            }

            return await response.json();
        },
    });

export const assignShareTagMutation = () =>
    mutationOptions({
        mutationFn: async ({
            token,
            tags,
            targets,
            password,
        }: {
            token: string;
            tags: { name: string; color: string }[];
            targets: { targetType: TagTargetType; targetId: string }[];
            password?: string;
        }) => {
            const response = await apiClient.api.share[
                ":token"
            ].tags.assign.$post({
                param: {
                    token,
                },
                json: {
                    tags,
                    targets,
                    password: password ?? undefined,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to assign tags");
            }

            return await response.json();
        },
    });

export const removeShareTagAssignmentMutation = () =>
    mutationOptions({
        mutationFn: async ({
            token,
            assignmentId,
            password,
        }: {
            token: string;
            assignmentId: string;
            password?: string;
        }) => {
            const response = await apiClient.api.share[":token"][
                "tag-assignments"
            ][":assignmentId"].$delete({
                param: { token, assignmentId },
                query: { password: password ?? undefined },
            });

            if (!response.ok) {
                throw new Error("Failed to remove tag assignment");
            }

            return await response.json();
        },
    });
