"use client";

import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertCircleIcon } from "lucide-react";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ColorPicker, PRESET_COLORS } from "@/components/ui/color-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/react-query/apiClient";
import { getQueryClient } from "@/react-query/get-query-client";
import {
    assignTagMutation,
    createTagMutation,
    updateTagMutation,
} from "@/react-query/queries/tag";

interface CreateTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workspaceId: string;
    targetType: TagTargetType;
    targetId: string;
}

export function CreateTagDialog({
    open,
    onOpenChange,
    workspaceId,
    targetType,
    targetId,
}: CreateTagDialogProps) {
    const queryClient = getQueryClient();
    const [tagName, setTagName] = useState("");
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
    const [existingTag, setExistingTag] = useState<{ id: string, name: string, color: string } | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const checkTagExists = async (name: string) => {
        if (!name.trim()) {
            setExistingTag(null);
            return;
        }

        setIsChecking(true);

        try {
            const response = await apiClient.api.workspaces[":workspaceId"].tags.$get({
                param: {
                    workspaceId,
                },
                query: {
                    name: name.trim()
                }
            });

            if (response.ok) {
                const tags = await response.json();

                const found = tags.data?.find(t => t.name === name.trim());
                setExistingTag(found || null);

                if (found) {
                    setSelectedColor(found.color);
                }
            }
        } catch(error) {
            console.error("Error checking tag exists", error);
        } finally {
            setIsChecking(false);
        }
    }

    const handleTagNameChange = (value: string) => {
        setTagName(value);

        const timer = setTimeout(() => {
            checkTagExists(value);
        }, 350);

        return () => clearTimeout(timer);
    }

    const { mutate: createTag, isPending: isCreatingTag } = useMutation({
        ...createTagMutation(),
        onSuccess: (response) => {
            const tag = response.data;
            if (tag?.id) {
                assignTag({
                    workspaceId,
                    tagId: tag.id,
                    targetType,
                    targetId,
                });
            }
        },
        onError: () => {
            toast.error("Failed to create tag");
        }
    });

    const { mutate: assignTag, isPending: isAssigningTag } = useMutation({
        ...assignTagMutation(),
        onSuccess: () => {
            toast.success("Tag assigned successfully");

            queryClient.invalidateQueries({
                queryKey: ["tags", workspaceId],
            });
            queryClient.invalidateQueries({
                queryKey: ["tags", workspaceId, targetType, targetId],
            });

            setTagName("");
            setSelectedColor(PRESET_COLORS[0]);
            handleOpenChange(false);
        },
        onError: () => {
            toast.error("Failed to assign tag");
        }
    });

    const { mutate: updateTag, isPending: isUpdatingTag } = useMutation({
        ...updateTagMutation(),
        onSuccess: (response) => {
            const tag = response.data;
            if (tag?.id) {
                assignTag({
                    workspaceId,
                    tagId: tag.id,
                    targetType,
                    targetId,
                });
            }
        },
        onError: () => {
            toast.error("Failed to update tag");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tagName.trim()) {
            toast.error("Tag name is required");
            return;
        }

        const toastId = nanoid();
        toast.loading(existingTag ? "Assigning tag..." : "Creating tag...", {
            id: toastId,
        });

        if (existingTag) {
            updateTag({
                workspaceId,
                tagId: existingTag.id,
                color: selectedColor,
            });
        } else {
            createTag({
                workspaceId,
                name: tagName.trim(),
                color: selectedColor,
            });
        }

        toast.dismiss(toastId);
    }

    const handleOpenChange = (open: boolean) => {
        console.log("handleOpenChange", open);
        if (!open) {
            setTagName("");
            setSelectedColor(PRESET_COLORS[0]);
            setExistingTag(null);
        }
        
        onOpenChange(open);
    }

    const isLoading = isCreatingTag || isAssigningTag || isUpdatingTag;
    const submitButtonText = existingTag ? "Assign Tag" : "Create Tag";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Tag</DialogTitle>
                    <DialogDescription>
                        Crate a new tag to assign to the item.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="tag-name" className="text-sm font-medium">
                            Tag Name
                        </label>
                        <Input 
                            id="tag-name"
                            placeholder="Enter tag name"
                            value={tagName}
                            onChange={e => handleTagNameChange(e.target.value)}
                            disabled={isLoading}
                            maxLength={255}
                        />

                        {existingTag && (
                            <div className="text-sm text-yellow-600 flex items-center gap-2">
                                <AlertCircleIcon className="size-4" />
                                <span>
                                    Tag is already exists.
                                </span>
                                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: existingTag.color }} />
                            </div>
                        )}
                    </div>

                    <ColorPicker 
                        value={selectedColor}
                        onChange={setSelectedColor}
                        disabled={isLoading}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => handleOpenChange(false)}
                            disabled={isLoading || isChecking}
                        >
                            取消
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading || !tagName.trim() || isChecking}
                        >
                            {isLoading ? "Processing...": submitButtonText}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}