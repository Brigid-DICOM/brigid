import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, TagsIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
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
    assignShareTagMutation,
    getTargetShareTagsQuery,
    removeShareTagAssignmentMutation,
} from "@/react-query/queries/share-tag";
import { useShareTagStore } from "@/stores/share-tag-store";
import { useT } from "@/app/_i18n/client";

interface ShareTagDropdownSubProps {
    token: string;
    targetType: TagTargetType;
    targetId: string;
    password?: string;
    onOpenCreateTagDialog: () => void;
}

interface OptimisticState {
    tagId: string;
    action: "assign" | "remove";
}

export function ShareTagDropdownSub({
    token,
    targetType,
    targetId,
    password,
    onOpenCreateTagDialog,
}: ShareTagDropdownSubProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [optimisticUpdates, setOptimisticUpdates] = useState<
        Map<string, OptimisticState>
    >(new Map());

    const { addCachedTag, removeCachedTag, getCachedTags } = useShareTagStore();
    const cachedTags = getCachedTags(token);

    const { data: tags, isLoading: isLoadingTags } = useQuery({
        ...getTargetShareTagsQuery(token, targetType, targetId, password),
    });

    const combinedTags = useMemo(() => {
        const assignedTagIds = new Set(tags?.data?.map((t) => t.id) ?? []);
        const result: Array<{
            id: string;
            name: string;
            color: string;
            isAssigned: boolean;
            assignments?: Array<{ id: string; targetId: string }>;
        }> = [];

        // Add assigned tags first
        for (const tag of tags?.data ?? []) {
            const optimistic = optimisticUpdates.get(tag.id);
            result.push({
                ...tag,
                isAssigned: optimistic ? optimistic.action === "assign" : true,
            });
        }

        // Add cached tags (exclude those already in API response)
        for (const cachedTag of cachedTags) {
            if (!assignedTagIds.has(cachedTag.id)) {
                const optimistic = optimisticUpdates.get(cachedTag.id);
                result.push({
                    ...cachedTag,
                    isAssigned: optimistic?.action === "assign",
                    assignments: [],
                });
            }
        }

        return result;
    }, [tags?.data, cachedTags, optimisticUpdates]);

    const { mutate: assignShareTag } = useMutation({
        ...assignShareTagMutation(),
        onSuccess: (data, variables) => {
            
            // Get the tagId from optimistic updates
            const tagIds = Array.from(optimisticUpdates.entries())
                .filter(([_, state]) => state.action === "assign")
                .map(([tagId]) => tagId);

            // Remove from cache (since it's re-assigned)
            for (const tag of variables.tags) {
                const cachedTag = cachedTags.find((t) => t.name === tag.name);
                if (cachedTag) {
                    removeCachedTag(token, cachedTag.id);
                }
            }

            queryClient.setQueryData(
                ["share-tags", token, targetType, targetId],
                (oldData: typeof tags) => {
                    if (!oldData) return oldData;

                    const newTags = [];
                    for (const tag of variables.tags) {
                        const alreadyExists = oldData.data?.some(
                            t => t.name === tag.name
                        );
                        if (!alreadyExists) {
                            const resultTag = data?.data?.results?.find(
                                (r: {tag: { name: string }}) => r.tag.name === tag.name
                            )?.tag;

                            newTags.push({
                                id: resultTag?.id ?? nanoid(),
                                name: tag.name,
                                color: tag.color,
                                assignments: [{
                                    id: nanoid(),
                                    targetId,
                                    targetType,
                                }],
                            });
                        }
                    }

                    return {
                        ...oldData,
                        data: [...(oldData.data || []), ...newTags],
                    }
                }
            );

            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                for (const tagId of tagIds) {
                    newMap.delete(tagId);
                }
                return newMap;
            });

            // Delay refetch to ensure correct assignment IDs
            setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ["share-tags", token, targetType, targetId],
                });
            }, 500);
        },
        onError: () => {
            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                for (const [tagId, state] of newMap) {
                    if (state.action === "assign") {
                        newMap.delete(tagId);
                    }
                }
                return newMap;
            });
            toast.error(t("share.messages.failedToAssignTags"));
        },
    });

    const { mutate: removeShareTagAssignment } = useMutation({
        ...removeShareTagAssignmentMutation(),
        onSuccess: (_, variables) => {
            // 找到被移除的 tag 並暫存
            // Find the removed tag and cache it
            const removedTag = tags?.data?.find((t) =>
                t.assignments?.some((a) => a.id === variables.assignmentId)
            );
            if (removedTag) {
                addCachedTag(token, {
                    id: removedTag.id,
                    name: removedTag.name,
                    color: removedTag.color,
                });
            }

            queryClient.setQueryData(
                ["share-tags", token, targetType, targetId],
                (oldData: typeof tags) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        data:
                            oldData.data?.filter(
                                (t) =>
                                    !t.assignments?.some(
                                        (a) => a.id === variables.assignmentId
                                    )
                            ) || [],
                    };
                }
            );

            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                for (const [tagId, state] of newMap) {
                    if (state.action === "remove") {
                        newMap.delete(tagId);
                    }
                }
                return newMap;
            });
        },
        onError: () => {
            setOptimisticUpdates((prev) => {
                const newMap = new Map(prev);
                for (const [tagId, state] of newMap) {
                    if (state.action === "remove") {
                        newMap.delete(tagId);
                    }
                }
                return newMap;
            });
            toast.error(t("share.messages.failedToRemoveTags"));
        },
    });

    const handleAssignTag = (tagId: string, tagName: string, tagColor: string) => {
        setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.set(tagId, { tagId, action: "assign" });
            return newMap;
        });

        assignShareTag({
            token,
            tags: [{ name: tagName, color: tagColor }],
            targets: [{ targetType, targetId }],
            password: password ?? undefined,
        });
    };

    const handleRemoveTagAssignment = (tagId: string) => {
        const tag = tags?.data?.find((t) => t.id === tagId);
        const assignmentId = tag?.assignments?.find(
            (a) => a.targetId === targetId
        )?.id;

        if (!assignmentId) return;

        setOptimisticUpdates((prev) => {
            const newMap = new Map(prev);
            newMap.set(tagId, { tagId, action: "remove" });
            return newMap;
        });

        removeShareTagAssignment({
            token,
            assignmentId,
            password: password ?? undefined,
        });
    };

    const handleToggleTag = (tag: typeof combinedTags[number]) => {
        if (tag.isAssigned) {
            handleRemoveTagAssignment(tag.id);
        } else {
            handleAssignTag(tag.id, tag.name, tag.color);
        }
    };

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t("dicom.tagContextMenu.tags")}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem
                    className="flex items-center space-x-2"
                    onClick={onOpenCreateTagDialog}
                >
                    <TagsIcon className="size-4" />
                    <span>{t("dicom.tagContextMenu.createTag")}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {isLoadingTags && (
                    <DropdownMenuItem className="flex items-center space-x-2">
                        <Loader2Icon className="size-4 animate-spin" />
                        <span>{t("common.loading")}</span>
                    </DropdownMenuItem>
                )}

                {!isLoadingTags && combinedTags.length === 0 && (
                    <DropdownMenuItem
                        disabled
                        className="text-muted-foreground"
                    >
                        <span>{t("dicom.tagContextMenu.noTags")}</span>
                    </DropdownMenuItem>
                )}

                {combinedTags.map((tag) => {
                    const isUpdating = optimisticUpdates.has(tag.id);

                    return (
                        <DropdownMenuItem
                            key={tag.id}
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleTag(tag);
                            }}
                            disabled={isUpdating}
                            className="opacity-100 data-[disabled]:opacity-50"
                        >
                            {tag.isAssigned ? (
                                <CheckIcon className="size-4" />
                            ) : (
                                <div className="size-4" />
                            )}
                            <div
                                className="size-4 rounded-full"
                                style={{ backgroundColor: tag.color }}
                            />
                            <span>{tag.name}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}