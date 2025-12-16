"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleSharePermission } from "@/lib/share/sharePermissionUtils";
import { apiClient } from "@/react-query/apiClient";
import { getQueryClient } from "@/react-query/get-query-client";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { Textarea } from "../ui/textarea";
import { ShareExpirationDropdown } from "./share-expiration-dropdown";
import { SharePermissionDropdown } from "./share-permission-dropdown";
import { UserSelector } from "./user-selector";

interface CreateShareTabProps {
    workspaceId: string;
    targetType: "study" | "series" | "instance";
    targetIds: string[];
    onSuccess?: () => void;
}

interface SelectedUser {
    userId: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    permissions: number;
}

export function CreateShareTab({
    workspaceId,
    targetType,
    targetIds,
    onSuccess,
}: CreateShareTabProps) {
    const { t } = useT("translation");
    const queryClient = getQueryClient();
    const [name, setName] = useState("");
    const [publicPermissions, setPublicPermissions] = useState(
        SHARE_PERMISSIONS.READ,
    );
    const [requiredPassword, setRequiredPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [expiresInSec, setExpiresInSec] = useState<number | null>(null);
    const [description, setDescription] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);

    const { mutate: createShareLink, isPending } = useMutation({
        mutationFn: async () => {
            const response = await apiClient.api.workspaces[":workspaceId"][
                "share-links"
            ].$post({
                param: { workspaceId },
                json: {
                    targetType,
                    targetIds,
                    name: name.trim() ?? `shared ${targetType}`,
                    publicPermissions: publicPermissions,
                    requiredPassword,
                    password: requiredPassword ? password : undefined,
                    expiresInSec: expiresInSec ?? undefined,
                    description,
                    recipients: selectedUsers.map((u) => ({
                        userId: u.userId,
                        permissions: u.permissions,
                    })),
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create share link");
            }

            return await response.json();
        },
        onSuccess: (data) => {
            toast.success(t("shareLink.messages.shareLinkCreated"), {
                position: "bottom-center",
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "share-links",
                    targetType,
                    targetIds.join(","),
                    workspaceId,
                ],
            });
            queryClient.invalidateQueries({
                queryKey: [
                    "share-link-count",
                    targetType,
                    targetIds.join(","),
                    workspaceId,
                ],
            });

            const shareUrl = `${window.location.origin}/share/${data?.data?.token ?? ""}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success(t("shareLink.messages.shareLinkCopied"), {
                position: "bottom-center",
            });
            resetForm();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(t("shareLink.messages.shareLinkCreatedError"), {
                position: "bottom-center",
            });
            console.error(error);
        },
    });

    const togglePermission = (permission: number) => {
        const newPermissions = toggleSharePermission(
            publicPermissions,
            permission,
        );

        setPublicPermissions(newPermissions);
    };

    const handleSelectUser = (user: SelectedUser) => {
        setSelectedUsers((prev) => {
            const existing = prev.find((u) => u.userId === user.userId);
            if (existing) {
                return prev.map((u) => (u.userId === user.userId ? user : u));
            }
            return [...prev, user];
        });
    };

    const handleRemoveUser = (userId: string) => {
        setSelectedUsers((prev) => prev.filter((u) => u.userId !== userId));
    };

    const handleSubmit = () => {
        if (targetIds.length === 0) {
            toast.error(t("shareLink.messages.pleaseSelectAtLeastOneTarget"), {
                position: "bottom-center",
            });
            return;
        }

        if (requiredPassword && !password.trim()) {
            toast.error(t("shareLink.messages.passwordRequired"), {
                position: "bottom-center",
            });
            return;
        }

        createShareLink();
    };

    const resetForm = () => {
        setPublicPermissions(SHARE_PERMISSIONS.READ);
        setRequiredPassword(false);
        setPassword("");
        setExpiresInSec(null);
        setDescription("");
        setSelectedUsers([]);
        setName("");
    };

    return (
        <div className="space-y-6 py-4">
            <div className="space-y-3">
                <Label htmlFor="name">{t("shareLink.form.name")}</Label>
                <Input
                    type="text"
                    id="name"
                    placeholder={t("shareLink.form.namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={255}
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="public-permissions">
                    {t("shareLink.form.publicPermissionsLabel")}
                </Label>
                <SharePermissionDropdown
                    mode="public"
                    publicPermissions={publicPermissions}
                    onTogglePermission={togglePermission}
                    id="public-permissions"
                />
            </div>

            <UserSelector
                selected={selectedUsers}
                onSelect={handleSelectUser}
                onRemove={handleRemoveUser}
            />

            <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="required-password"
                        checked={requiredPassword}
                        onCheckedChange={(checked) =>
                            setRequiredPassword(checked as boolean)
                        }
                    />
                    <Label htmlFor="required-password">
                        {t("shareLink.form.requiredPasswordLabel")}
                    </Label>
                </div>

                {requiredPassword && (
                    <Input
                        type="password"
                        id="password"
                        placeholder={t("shareLink.form.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="expires-in">
                    {t("shareLink.form.expiresInLabel")}
                </Label>
                <ShareExpirationDropdown
                    expiresInSec={expiresInSec}
                    onSelect={setExpiresInSec}
                    id="expires-in"
                />
            </div>

            <div className="space-y-3">
                <Label htmlFor="description">
                    {t("shareLink.form.descriptionLabel")}
                </Label>
                <Textarea
                    id="description"
                    placeholder={t("shareLink.form.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                    isPending ||
                    targetIds.length === 0 ||
                    (requiredPassword && !password.trim())
                }
            >
                {isPending
                    ? t("shareLink.form.creating")
                    : t("shareLink.form.create")}
            </Button>
        </div>
    );
}
