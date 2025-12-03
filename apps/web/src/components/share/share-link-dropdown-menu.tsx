"use client";

import { useQuery } from "@tanstack/react-query";
import { CopyIcon, EditIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { closeDropdownMenu } from "@/lib/utils";
import { authSessionQuery } from "@/react-query/queries/session";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { ShareDeleteConfirmDialog } from "./share-delete-confirm-dialog";
import { ShareLinkEditDialog } from "./share-link-edit-dialog";
import type { ShareLinkFormData } from "./share-link-edit-form";

interface ShareLinkDropdownMenuProps {
    children: React.ReactNode;
    shareLink: ShareLinkFormData;
    workspaceId: string;
    onDeleted?: () => void;
}

export function ShareLinkDropdownMenu({
    children,
    shareLink,
    workspaceId,
    onDeleted,
}: ShareLinkDropdownMenuProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: userSession } = useQuery(authSessionQuery());

    const isCreator = useMemo(() => {
        return userSession?.user?.id === shareLink.creatorId;
    }, [userSession, shareLink.creatorId]);

    const canEdit = useMemo(() => {
        return hasPermission(shareLink.publicPermissions, SHARE_PERMISSIONS.UPDATE) || isCreator;
    }, [shareLink.publicPermissions, isCreator]);

    const shareUrl = `${window.location.origin}/share/${shareLink.token}`;

    const handleOpenShare = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdownMenu();
        window.open(shareUrl, "_blank");
    };

    const handleCopyLink = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdownMenu();
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
    };

    const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdownMenu();
        setShowEditDialog(true);
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();
        closeDropdownMenu();
        setShowDeleteDialog(true);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

                <DropdownMenuContent className="w-48">
                    <DropdownMenuItem
                        onClick={handleOpenShare}
                        className="flex items-center gap-2"
                    >
                        <ExternalLinkIcon className="size-4" />
                        <span>Open Share</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleCopyLink}
                        className="flex items-center gap-2"
                    >
                        <CopyIcon className="size-4" />
                        <span>Copy Link</span>
                    </DropdownMenuItem>

                    {canEdit && (
                        <DropdownMenuItem
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <EditIcon className="size-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {isCreator && (
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                            <Trash2Icon className="size-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <ShareLinkEditDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                shareLink={shareLink}
                workspaceId={workspaceId}
            />

            <ShareDeleteConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                shareLinkId={shareLink.id}
                workspaceId={workspaceId}
                onSuccess={onDeleted}
            />
        </>
    );
}
