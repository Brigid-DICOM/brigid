import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    assignTagMutation,
    getTargetTagsQuery,
    getWorkspaceTagsQuery,
    removeTagAssignmentMutation,
} from "@/react-query/queries/tag";
import { useT } from "@/app/_i18n/client";

interface TagDropdownSubProps {
    workspaceId: string;
    targetId: string;
    targetType: "study" | "series" | "instance";
    onOpenCreateTagDialog: () => void;
}

interface OptimisticState {
    tagId: string;
    action: "assign" | "remove";
}

export function TagDropdownSub({
    workspaceId,
    targetId,
    targetType,
    onOpenCreateTagDialog,
}: TagDropdownSubProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [optimisticUpdates, setOptimisticUpdates] = useState<
        Map<string, OptimisticState>
    >(new Map());

    const { data: workspaceTags, isLoading: isLoadingWorkspaceTags } = useQuery(
        {
            ...getWorkspaceTagsQuery(workspaceId),
        },
    );

    const { data: tags, isLoading: isLoadingTags } = useQuery({
        ...getTargetTagsQuery(workspaceId, targetType, targetId),
    });

    const getIsAssigned = (tagId: string) => {
        const optimistic = optimisticUpdates.get(tagId);

        const currentAssigned =
            tags?.data?.some((t) => t.id === tagId) ?? false;

        if (optimistic) {
            return optimistic.action === "assign";
        }

        return currentAssigned;
    };

    const combinedTags = workspaceTags?.data?.map((tag) => ({
        ...tag,
        isAssigned: getIsAssigned(tag.id),
    }));

    const { mutate: assignTag } = useMutation({
        ...assignTagMutation(),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(
                ["tags", workspaceId, targetType, targetId],
                (oldData: any) => {
                    if (!oldData) return oldData;

                    const alreadyExists = oldData.data?.some(
                        (t: any) => t.id === variables.tagId,
                    );
                    if (alreadyExists) return oldData;

                    // 從 workspace tags 中找到該標籤
                    const tagToAdd = workspaceTags?.data?.find(
                        (t: any) => t.id === variables.tagId,
                    );
                    if (!tagToAdd) return oldData;

                    return {
                        ...oldData,
                        data: [...(oldData.data || []), tagToAdd],
                    };
                },
            );

            queryClient.invalidateQueries({
                queryKey: ["tags", workspaceId],
            });

            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                newMap.delete(variables.tagId);
                return newMap;
            });
        },
        onError: (_, variables) => {
            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                newMap.delete(variables.tagId);
                return newMap;
            });
            toast.error(t("dicom.messages.failedToAssignTag"));
        },
    });

    const { mutate: removeTagAssignment } = useMutation({
        ...removeTagAssignmentMutation(),
    });

    const handleAssignTag = (tagId: string) => {
        setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.set(tagId, { tagId, action: "assign" });
            return newMap;
        });

        assignTag({
            workspaceId,
            tagId,
            targetType,
            targetId,
        });
    };

    const handleRemoveTagAssignment = (tagId: string) => {
        const tag = tags?.data.find((t) => t.id === tagId);
        const assignmentId = tag?.assignments?.find(
            (a) => a.targetId === targetId,
        )?.id;

        if (!assignmentId) return;

        setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.set(tagId, { tagId, action: "remove" });
            return newMap;
        });

        removeTagAssignment(
            {
                workspaceId,
                assignmentId: assignmentId as string,
            },
            {
                onSuccess: () => {
                    queryClient.setQueryData(
                        ["tags", workspaceId, targetType, targetId],
                        (oldData: any) => {
                            if (!oldData) return oldData;

                            // 移除該標籤
                            return {
                                ...oldData,
                                data:
                                    oldData.data?.filter(
                                        (t: any) => t.id !== tagId,
                                    ) || [],
                            };
                        },
                    );

                    setOptimisticUpdates((prev) => {
                        const next = new Map(prev);
                        next.delete(tagId);
                        return next;
                    });
                },
                onError: () => {
                    setOptimisticUpdates((prev) => {
                        const newMap = new Map(prev);
                        newMap.delete(tagId);
                        return newMap;
                    });
                    toast.error(t("dicom.messages.failedToRemoveTagAssignment"));
                },
            },
        );
    };

    const handleToggleTag = (tagId: string) => {
        const isCurrentlyAssigned = getIsAssigned(tagId);

        if (isCurrentlyAssigned) {
            handleRemoveTagAssignment(tagId);
        } else {
            handleAssignTag(tagId);
        }
    };

    const isLoading = isLoadingWorkspaceTags || isLoadingTags;

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {t("dicom.tagContextMenu.tags")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem
                    className="flex items-center space-x-2"
                    onClick={onOpenCreateTagDialog}
                >
                    {t("dicom.tagContextMenu.createTag")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {isLoading && (
                    <DropdownMenuItem className="flex items-center space-x-2">
                        <Loader2Icon className="size-4 animate-spin" />
                        <span>{t("common.loading")}</span>
                    </DropdownMenuItem>
                )}

                {combinedTags?.map((tag) => {
                    const isAssigned = getIsAssigned(tag.id);
                    const isUpdating = optimisticUpdates.has(tag.id);

                    return (
                        <DropdownMenuItem
                            key={tag.id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleTag(tag.id);
                            }}
                            disabled={isUpdating}
                            className="opacity-100 data-[disabled]:opacity-50"
                        >
                            {isAssigned ? (
                                <CheckIcon className="size-4" />
                            ) : (
                                <div className="size-4" />
                            )}
                            <div
                                className="size-4 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            ></div>
                            <span>{tag.name}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}
