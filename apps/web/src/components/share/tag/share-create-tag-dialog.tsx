"use client";

import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
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
import { getQueryClient } from "@/react-query/get-query-client";
import { assignShareTagMutation } from "@/react-query/queries/share-tag";

// 暫時先只支援單一目標
interface ShareCreateTagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    token: string;
    targetType: TagTargetType;
    targetId: string;
    password?: string;
}

export function ShareCreateTagDialog({
    open,
    onOpenChange,
    token,
    targetType,
    targetId,
    password,
}: ShareCreateTagDialogProps) {
    const queryClient = getQueryClient();
    const [tagName, setTagName] = useState("");
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
    

    const handleTagNameChange = (value: string) => {
        setTagName(value);
    }

    const { mutate: assignShareTag, isPending: isAssigningShareTag } = useMutation({
        ...assignShareTagMutation(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tagName.trim()) {
            toast.error("Tag name is required", {
                position: "bottom-center",
            });
            return;
        }

        const toastId = nanoid();
        toast.loading("Assigning tag...", {
            id: toastId,
        });

        assignShareTag({
            token,
            tags: [{
                name: tagName.trim(),
                color: selectedColor,
            }],
            targets: [{
                targetType,
                targetId,
            }],
            password: password ?? undefined,
        }, {
            onSuccess: () => {
                toast.success("Tag assigned successfully");
                queryClient.invalidateQueries({
                    queryKey: ["share-tags", token, targetType, targetId],
                });
                toast.dismiss(toastId);
            },
            onError: () => {
                toast.error("Failed to assign tag");
                toast.dismiss(toastId);
            }
        })
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTagName("");
            setSelectedColor(PRESET_COLORS[0]);
        }

        onOpenChange(open);
    }

    const isLoading = isAssigningShareTag;

    return createPortal(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Tag</DialogTitle>
                    <DialogDescription>
                        Create a new tag to assign to the item.
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
                            disabled={isLoading}
                        >
                            取消
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Assigning...": "Assign Tag"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>,
        document.body,
    )
}

