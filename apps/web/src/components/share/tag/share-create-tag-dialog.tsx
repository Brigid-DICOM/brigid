"use client";

import type { TagTargetType } from "@brigid/database/src/entities/tagAssignment.entity";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import type React from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import { ColorPicker, PRESET_COLORS } from "@/components/ui/color-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getQueryClient } from "@/react-query/get-query-client";
import { assignShareTagMutation } from "@/react-query/queries/share-tag";

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
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [tagName, setTagName] = useState("");
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const handleTagNameChange = (value: string) => {
        setTagName(value);
    };

    const { mutate: assignShareTag, isPending: isAssigningShareTag } =
        useMutation({
            ...assignShareTagMutation(),
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!tagName.trim()) {
            toast.error(t("createTagDialog.messages.tagNameRequired"), {
                position: "bottom-center",
            });
            return;
        }

        const toastId = nanoid();
        toast.loading(t("createTagDialog.messages.assigning"), {
            id: toastId,
        });

        assignShareTag(
            {
                token,
                tags: [
                    {
                        name: tagName.trim(),
                        color: selectedColor,
                    },
                ],
                targets: [
                    {
                        targetType,
                        targetId,
                    },
                ],
                password: password ?? undefined,
            },
            {
                onSuccess: () => {
                    toast.success(
                        t("createTagDialog.messages.assigningSuccess"),
                    );
                    queryClient.invalidateQueries({
                        queryKey: ["share-tags", token, targetType, targetId],
                    });
                    toast.dismiss(toastId);
                },
                onError: () => {
                    toast.error(t("createTagDialog.messages.assigningError"));
                    toast.dismiss(toastId);
                },
            },
        );
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setTagName("");
            setSelectedColor(PRESET_COLORS[0]);
        }

        onOpenChange(open);
    };

    const isLoading = isAssigningShareTag;

    return createPortal(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t("createTagDialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("createTagDialog.description", { targetType })}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="tag-name"
                            className="text-sm font-medium"
                        >
                            {t("createTagDialog.tagName")}
                        </label>
                        <Input
                            id="tag-name"
                            placeholder={t(
                                "createTagDialog.tagNamePlaceholder",
                            )}
                            value={tagName}
                            onChange={(e) =>
                                handleTagNameChange(e.target.value)
                            }
                            disabled={isLoading}
                            maxLength={255}
                        />
                    </div>

                    <ColorPicker
                        value={selectedColor}
                        onChange={setSelectedColor}
                        disabled={isLoading}
                        labels={{
                            title: t("createTagDialog.colorPicker.title"),
                            customColorHint: t(
                                "createTagDialog.colorPicker.customColorHint",
                            ),
                        }}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant={"outline"}
                            onClick={() => handleOpenChange(false)}
                            disabled={isLoading}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? t("common.loading")
                                : t("createTagDialog.assignTag")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>,
        document.body,
    );
}
