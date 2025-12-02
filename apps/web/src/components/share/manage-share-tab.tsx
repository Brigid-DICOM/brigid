"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow, isPast } from "date-fns";
import { ClockIcon, CopyIcon, EditIcon, EyeIcon, LockIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { toggleSharePermission } from "@/lib/share/sharePermissionUtils";
import { apiClient } from "@/react-query/apiClient";
import { getQueryClient } from "@/react-query/get-query-client";
import { getTargetShareLinksQuery } from "@/react-query/queries/share";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ShareDeleteConfirmDialog } from "./share-delete-confirm-dialog";
import { ShareExpirationDropdown } from "./share-expiration-dropdown";
import { SharePermissionDropdown } from "./share-permission-dropdown";
import { UserSelector } from "./user-selector";

interface ManageShareTabProps {
    workspaceId: string;
    targetType: "study" | "series" | "instance";
    targetIds: string[];
}

interface ShareLink {
    id: string;
    name?: string;
    token: string;
    publicPermissions: number;
    requiredPassword: boolean;
    expiresInSec?: number;
    expiresAt?: Date;
    accessCount: number;
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

export function ManageShareTab({ workspaceId, targetType, targetIds }: ManageShareTabProps) {
    const queryClient = getQueryClient();
    const [editingShare, setEditingShare] = useState<ShareLink | null>(null);
    const [updatedShare, setUpdatedShare] = useState<Partial<ShareLink>>({});
    const [targetIdToDelete, setTargetIdToDelete] = useState<string | null>(null);
    const [showDeleteConfirmDialogOpen, setShowDeleteConfirmDialogOpen] = useState(false);

    const recipients = useMemo(() => {
        const share = updatedShare.recipients ?? editingShare?.recipients ?? [];
        return share.map((recipient) => ({
            userId: recipient.userId,
            permissions: recipient.permissions,
            user: recipient.user,
        }));
    }, [editingShare, updatedShare]);

    const {data: shareLinks, isLoading} = useQuery(
        getTargetShareLinksQuery({
            targetType,
            targetIds: targetIds,
            workspaceId,
            limit: 10,
            page: 1,
        })
    )

    const {mutate: updateShareLink, isPending: isUpdating} = useMutation({
        mutationFn: async ({ shareLinkId, updates }: { shareLinkId: string, updates: Partial<ShareLink> }) => {
            const response = await apiClient.api.workspaces[":workspaceId"]["share-links"][":shareLinkId"].$patch({
                param: { workspaceId, shareLinkId },
                json: updates
            });

            if (!response.ok) {
                throw new Error("Failed to update share link");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Share link updated successfully");
            queryClient.invalidateQueries({
                queryKey: ["share-links", targetType, targetIds.join(","), workspaceId],
            });
            setEditingShare(null);
            setUpdatedShare({});
        },
        onError: () => {
            toast.error("Failed to update share link");
        }
    });
    
    const copyShareLink = (token: string) => {
        const shareUrl = `${window.location.origin}/share/${token}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
    };

    const isExpired = (expiresAt: Date | undefined) => {
        if (!expiresAt) return false;
        return isPast(new Date(expiresAt));
    }

    if (!editingShare) {
        return (
            <div className="space-y-4 py-4">
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                        Loading share links...
                    </div>
                ) : shareLinks?.data.shareLinks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No share links yet. Create one in the "Create Share" tab.
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {shareLinks?.data.shareLinks.map((share) => {
                            const expired = isExpired(
                                share.expiresAt ? new Date(share.expiresAt) : undefined
                            );

                            return (
                                <div
                                    key={share.id}
                                    className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            {/* share link info */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                                                    {share.token.slice(0, 8)}...
                                                </code>

                                                {expired && (
                                                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                        Expired
                                                    </span>
                                                )}

                                                {share.requiredPassword && (
                                                    <LockIcon className="w-3 h-3 text-gray-500" />
                                                )}

                                                {share.publicPermissions === 0 ? (
                                                    <Badge variant="outline">Private</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-blue-500 text-white">Public</Badge>
                                                )}
                                            </div>

                                            {/* share description */}
                                            {share.description && (
                                                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                                                    {share.description}
                                                </p>
                                            )}

                                            {/* metadata */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <EyeIcon className="w-3 h-3" />
                                                    {share.accessCount} views
                                                </span>

                                                {share.expiresAt && (
                                                    <span
                                                        className={`flex items-center gap-1 ${
                                                            expired ? "text-red-500" : ""
                                                        }`}
                                                    >
                                                        <ClockIcon className="w-3 h-3" />
                                                        {expired
                                                            ? "Expired"
                                                            : `Expires ${formatDistanceToNow(
                                                                  new Date(share.expiresAt),
                                                                  { addSuffix: true }
                                                              )}`}
                                                    </span>
                                                )}

                                                {share.recipients.length > 0 && (
                                                    <span>
                                                        {share.recipients.length} recipient
                                                        {share.recipients.length > 1 ? "s" : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* action buttons */}
                                        <div className="flex gap-1 flex-shrink-0">
                                            <Button
                                                variant={"ghost"}
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    copyShareLink(share.token);
                                                }}
                                                title="Copy Share Link"
                                            >
                                                <CopyIcon className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingShare(share as ShareLink);
                                                    setUpdatedShare({});
                                                }}
                                                title="Edit share link"
                                            >
                                                <EditIcon className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setTargetIdToDelete(share.id);
                                                    setShowDeleteConfirmDialogOpen(true);
                                                }}
                                                title="Delete share link"
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2Icon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {targetIdToDelete && (
                    <ShareDeleteConfirmDialog 
                        open={showDeleteConfirmDialogOpen}
                        onOpenChange={setShowDeleteConfirmDialogOpen}
                        shareLinkId={targetIdToDelete}
                        workspaceId={workspaceId}
                        onSuccess={() => {
                            queryClient.invalidateQueries({
                                queryKey: ["share-links", targetType, targetIds.join(","), workspaceId],
                            });
                            queryClient.invalidateQueries({
                                queryKey: ["share-link-count", targetType, targetIds.join(","), workspaceId],
                            });
                            setShowDeleteConfirmDialogOpen(false);
                            setTargetIdToDelete(null);
                        }}
                    />
                )}
            </div>
        );
    }

    const handleUpdate = () => {
        if (Object.keys(updatedShare).length === 0) {
            toast.info("No changes to update");
            return;
        }

        updateShareLink({
            shareLinkId: editingShare.id,
            updates: updatedShare,
        });
    };

    const handleSelectUser = (user: ShareLink["recipients"][number]) => {
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
    };

    const handleRemoveUser = (userId: string) => {
        setUpdatedShare((prev) => {
            return {
                ...prev,
                recipients: prev.recipients?.filter((u) => u.userId !== userId) ?? [],
            };
        });
    }

    return (
        <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">Edit Share Link</h3>
                <p className="text-xs text-gray-500 mt-1">
                    Token: {editingShare.token.slice(0, 16)}...
                </p>
            </div>

            <div className="space-y-3">
                <Label>Share Link</Label>
                <Input
                    value={`${window.location.origin}/share/${editingShare.token}`}
                    readOnly
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/share/${editingShare.token}`);
                        toast.success("Share link copied to clipboard", {
                            position: "bottom-center",
                        });
                    }}
                />
            </div>

            <div className="space-y-3">
                <Label>Name</Label>
                <Input
                    type="text"
                    placeholder="Enter name"
                    value={updatedShare.name ?? editingShare.name ?? ""}
                    onChange={(e) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            name: e.target.value.trim() ?? undefined,
                        }));
                    }}
                    maxLength={255}
                />
            </div>

            <div className="space-y-3">
                <Label>Public Permissions</Label>
                <SharePermissionDropdown
                    mode="public"
                    publicPermissions={updatedShare.publicPermissions ?? editingShare.publicPermissions ?? 0}
                    onTogglePermission={(permission) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            publicPermissions: toggleSharePermission(prev.publicPermissions ?? editingShare.publicPermissions ?? 0, permission),
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
                        checked={updatedShare.requiredPassword ?? editingShare.requiredPassword}
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

                {(updatedShare.requiredPassword ?? editingShare.requiredPassword) && (
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
                    expiresInSec={updatedShare.expiresInSec ?? editingShare.expiresInSec ?? null}
                    onSelect={(expiresInSec) => {
                        setUpdatedShare((prev) => ({
                            ...prev,
                            expiresInSec: expiresInSec ?? undefined,
                        }));
                    }}
                    id="edit-expires-in"
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
                <Button
                    variant="outline"
                    onClick={() => {
                        setEditingShare(null);
                        setUpdatedShare({});
                    }}
                    disabled={isUpdating}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}