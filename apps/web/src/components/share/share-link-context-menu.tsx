"use client";

import {
    CopyIcon,
    EditIcon,
    ExternalLinkIcon,
    Trash2Icon
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import { closeContextMenu } from "@/lib/utils";
import { ShareDeleteConfirmDialog } from "./share-delete-confirm-dialog";
import { ShareLinkEditDialog } from "./share-link-edit-dialog";
import type { ShareLinkFormData } from "./share-link-edit-form";

interface ShareLinkContextMenuProps {
    children: React.ReactNode;
    shareLink: ShareLinkFormData;
    workspaceId: string;
    onDeleted?: () => void;
}

export function ShareLinkContextMenu({
    children,
    shareLink,
    workspaceId,
    onDeleted,
}: ShareLinkContextMenuProps) {
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const shareUrl = `${window.location.origin}/share/${shareLink.token}`;

    const handleOpenShare = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        window.open(shareUrl, "_blank");
    };

    const handleCopyLink = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard");
    };

    
    const handleEdit = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowEditDialog(true);
    };

    const handleDelete = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        setShowDeleteDialog(true);
    };

    return (
        <>
            <ContextMenu>
                <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

                <ContextMenuContent className="w-48">
                    <ContextMenuItem
                        onClick={handleOpenShare}
                        className="flex items-center gap-2"
                    >
                        <ExternalLinkIcon className="size-4" />
                        <span>Open Share</span>
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={handleCopyLink}
                        className="flex items-center gap-2"
                    >
                        <CopyIcon className="size-4" />
                        <span>Copy Link</span>
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                    >
                        <EditIcon className="size-4" />
                        <span>Edit</span>
                    </ContextMenuItem>

                    <ContextMenuSeparator />

                    <ContextMenuItem
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-destructive focus:text-destructive"
                    >
                        <Trash2Icon className="size-4" />
                        <span>Delete</span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>

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