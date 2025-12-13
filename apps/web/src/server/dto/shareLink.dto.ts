import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { ApiShareLinkData, ShareTargetType } from "@brigid/types";

export const toApiShareLinkData = (
    shareLink: ShareLinkEntity,
): ApiShareLinkData => {
    return {
        id: shareLink.id,
        creatorId: shareLink.creatorId,
        workspaceId: shareLink.workspaceId,
        token: shareLink.token,
        publicPermissions: shareLink.publicPermissions,
        requiredPassword: shareLink.requiredPassword,
        accessCount: shareLink.accessCount,
        createdAt: shareLink.createdAt.toISOString(),
        name: shareLink.name ?? undefined,
        description: shareLink.description ?? undefined,
        expiresInSec: shareLink.expiresInSec ?? undefined,
        expiresAt: shareLink.expiresAt?.toISOString() ?? undefined,
        recipients: shareLink.recipients.map((r) => ({
            userId: r.userId,
            permissions: r.permissions,
            user: {
                id: r.user.id ?? "",
                name: r.user.name ?? "",
                email: r.user.email ?? "",
                image: r.user.image ?? undefined,
            },
        })),
        targets: shareLink.targets.map((t) => ({
            id: t.id,
            targetType: t.targetType as ShareTargetType,
            targetId: t.targetId,
        })),
    };
};
