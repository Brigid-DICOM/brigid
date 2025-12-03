"use client";

import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toggleSharePermission } from "@/lib/share/sharePermissionUtils";
import { apiClient } from "@/react-query/apiClient";
import { getQueryClient } from "@/react-query/get-query-client";
import { ShareExpirationDropdown } from "./share-expiration-dropdown";
import { SharePermissionDropdown } from "./share-permission-dropdown";
import { UserSelector } from "./user-selector";

export interface ShareLinkFormData {
    id: string;
    creatorId: string;
    name?: string;
    token: string;
    publicPermissions: number;
    requiredPassword: boolean;
    expiresInSec?: number;
    expiresAt?: Date;
    description?: string;
    recipients: Array<{
        userId: string;
        user: {
            id: string;
            name: string;
            email: string;
            image?: string;
        };
        permissions: number;
    }>;
}

interface ShareLinkEditFormProps {
    shareLink: ShareLinkFormData;
    workspaceId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function ShareLinkEditForm({ shareLink, workspaceId, onSuccess, onCancel }: ShareLinkEditFormProps) {
    const queryClient = getQueryClient();
    const [updatedShare, setUpdatedShare] = useState<Partial<ShareLinkFormData>>({});

    const recipients = useMemo(() => {
        const share = updatedShare.recipients ?? shareLink.recipients ?? [];

        return share.map((recipient) => ({
            userId: recipient.userId,
            permissions: recipient.permissions,
            user: recipient.user,
        }));
    }, [updatedShare, shareLink]);

    const { mutate: updateShareLink, isPending: isUpdating } = useMutation({
        mutationFn: async ({ shareLinkId, updates }: { shareLinkId: string, updates: Partial<ShareLinkFormData> }) => {
            const response = await apiClient.api.workspaces[":workspaceId"]["share-links"][":shareLinkId"].$patch({
                param: { workspaceId, shareLinkId },
                json: updates,
            });

            if (!response.ok) {
                throw new Error("Failed to update share link");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Share link updated successfully", {
                position: "bottom-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["user-share-links", workspaceId],
            });
            queryClient.invalidateQueries({
                queryKey: ["share-links"],
            });
            onSuccess?.();
        },
        onError: () => {
            toast.error("Failed to update share link", {
                position: "bottom-center",
            });
        }
    });

    const handleUpdate = () => {
        if (Object.keys(updatedShare).length === 0) {
            toast.info("No changes to update", {
                position: "bottom-center",
            });
            return;
        }

        updateShareLink({
            shareLinkId: shareLink.id,
            updates: updatedShare,
        });
    }

    const handleSelectUser = (user: ShareLinkFormData["recipients"][number]) => {
        setUpdatedShare((prev) => {
            const existing = prev.recipients?.find((u) => u.userId === user.userId);
            if (existing) {
                return {
                    ...prev,
                    recipients: prev.recipients?.map((u) => (u.userId === user.userId ? user : u)) ?? [],
                };
            }
            return {
                ...prev,
                recipients: [...(prev.recipients ?? []), user],
            };
        });
    }

    const handleRemoveUser = (userId: string) => {
        setUpdatedShare((prev) => ({
            ...prev,
            recipients: prev.recipients?.filter((u) => u.userId !== userId) ?? [],
        }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label>Share Link</Label>
                <Input
                    value={`${window.location.origin}/share/${shareLink.token}`}
                    readOnly
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/share/${shareLink.token}`);
                        toast.success("Share link copied to clipboard");
                    }}
                />
            </div>

            <div className="space-y-3">
                <Label>Name</Label>
                <Input
                    type="text"
                    placeholder="Enter name"
                    value={updatedShare.name ?? shareLink.name ?? ""}
                    onChange={(e) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            name: e.target.value.trim() || undefined,
                        }));
                    }}
                    maxLength={255}
                />
            </div>

            <div className="space-y-3">
                <Label>Public Permissions</Label>
                <SharePermissionDropdown
                    mode="public"
                    publicPermissions={updatedShare.publicPermissions ?? shareLink.publicPermissions ?? 0}
                    onTogglePermission={(permission) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            publicPermissions: toggleSharePermission(
                                prev.publicPermissions ?? shareLink.publicPermissions ?? 0,
                                permission
                            ),
                        }));
                    }}
                    id="public-permissions"
                />
            </div>

            <UserSelector
                selected={recipients}
                onSelect={handleSelectUser}
                onRemove={handleRemoveUser}
            />

            <div className="space-y-3 border-t pt-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="editRequiredPassword"
                        checked={updatedShare.requiredPassword ?? shareLink.requiredPassword}
                        onCheckedChange={(checked) => {
                            setUpdatedShare((prev) => ({
                                ...prev,
                                requiredPassword: checked as boolean,
                            }));
                        }}
                        disabled={isUpdating}
                    />
                    <Label htmlFor="editRequiredPassword" className="font-normal">
                        Require Password Protection
                    </Label>
                </div>

                {(updatedShare.requiredPassword ?? shareLink.requiredPassword) && (
                    <Input
                        type="password"
                        placeholder="Enter new password (leave blank to keep current)"
                        onChange={(e) => {
                            if (e.target.value) {
                                setUpdatedShare((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }));
                            }
                        }}
                        disabled={isUpdating}
                    />
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="editExpiresInSec">Expires In</Label>
                <ShareExpirationDropdown
                    expiresInSec={updatedShare.expiresInSec ?? shareLink.expiresInSec ?? null}
                    onSelect={(expiresInSec) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            expiresInSec: expiresInSec ?? undefined,
                        }));
                    }}
                    id="edit-expires-in"
                />
            </div>

            <div className="space-y-3">
                <Label>Description</Label>
                <Textarea
                    placeholder="Add a note about this share..."
                    value={updatedShare.description ?? shareLink.description ?? ""}
                    onChange={(e) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            description: e.target.value.trim() || undefined,
                        }));
                    }}
                    maxLength={255}
                />
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleUpdate}
                    disabled={isUpdating || Object.keys(updatedShare).length === 0}
                    className="flex-1"
                >
                    {isUpdating ? "Updating..." : "Update"}
                </Button>
                <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}