"use client";

import type { ClientShareLinkData } from "@brigid/types";
import { useQuery } from "@tanstack/react-query";
import { CopyIcon, EditIcon, ExternalLinkIcon, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import type React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useT } from "@/app/_i18n/client";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { closeContextMenu } from "@/lib/utils";
import { authSessionQuery } from "@/react-query/queries/session";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { hasPermission } from "@/server/utils/sharePermissions";
import { ShareDeleteConfirmDialog } from "./share-delete-confirm-dialog";
import { ShareLinkEditDialog } from "./share-link-edit-dialog";

interface ShareLinkContextMenuProps {
    children: React.ReactNode;
    shareLink: ClientShareLinkData;
    workspaceId: string;
    onDeleted?: () => void;
}

export function ShareLinkContextMenu({
    children,
    shareLink,
    workspaceId,
    onDeleted,
}: ShareLinkContextMenuProps) {
    const { t } = useT("translation");
    const { lng } = useParams<{ lng: string }>();
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { data: userSession } = useQuery(authSessionQuery());

    const shareUrl = `${window.location.origin}/${lng}/share/${shareLink.token}`;

    const isCreator = useMemo(() => {
        return userSession?.user?.id === shareLink.creatorId;
    }, [userSession, shareLink.creatorId]);

    const canEdit = useMemo(() => {
        return (
            hasPermission(
                shareLink.publicPermissions,
                SHARE_PERMISSIONS.UPDATE,
            ) || isCreator
        );
    }, [shareLink.publicPermissions, isCreator]);

    const handleOpenShare = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        window.open(shareUrl, "_blank");
    };

    const handleCopyLink = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        closeContextMenu();
        navigator.clipboard.writeText(shareUrl);
        toast.success(t("shareLink.messages.shareLinkCopied"));
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
                        <span>{t("shareLink.menu.openShare")}</span>
                    </ContextMenuItem>

                    <ContextMenuItem
                        onClick={handleCopyLink}
                        className="flex items-center gap-2"
                    >
                        <CopyIcon className="size-4" />
                        <span>{t("shareLink.menu.copyLink")}</span>
                    </ContextMenuItem>

                    {canEdit && (
                        <ContextMenuItem
                            onClick={handleEdit}
                            className="flex items-center gap-2"
                        >
                            <EditIcon className="size-4" />
                            <span>{t("shareLink.menu.edit")}</span>
                        </ContextMenuItem>
                    )}

                    <ContextMenuSeparator />

                    {isCreator && (
                        <ContextMenuItem
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                            <Trash2Icon className="size-4" />
                            <span>{t("shareLink.menu.delete")}</span>
                        </ContextMenuItem>
                    )}
                </ContextMenuContent>
            </ContextMenu>

            {canEdit && (
                <ShareLinkEditDialog
                    open={showEditDialog}
                    onOpenChange={setShowEditDialog}
                    shareLink={shareLink}
                    workspaceId={workspaceId}
                />
            )}

            {isCreator && (
                <ShareDeleteConfirmDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                    shareLinkId={shareLink.id}
                    workspaceId={workspaceId}
                    onSuccess={onDeleted}
                />
            )}
        </>
    );
}
