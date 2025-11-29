import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import { createMiddleware } from "hono/factory";
import type { SharePermissionsType } from "../const/share.const";
import { hasPermission } from "../utils/sharePermissions";

interface ShareLinkEnv {
    Variables: {
        shareLink: ShareLinkEntity;
        workspaceId: string;
        authUser?: {
            user?: {
                id?: string;
            };
        };
    };
}

export const verifyShareLinkPermission = (requiredPermission: SharePermissionsType) => {
    return createMiddleware<ShareLinkEnv>(
        async (c, next) => {
            const shareLink = c.get("shareLink") as ShareLinkEntity;
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            let permissions = shareLink.publicPermissions;
            
            if (userId && shareLink.recipients) {
                const recipient = shareLink.recipients.find((r) => r.userId === userId);
                if (recipient) {
                    permissions = recipient.permissions;
                }
            }

            if (!hasPermission(permissions, requiredPermission)) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "You do not have permission to perform this action",
                    },
                    403,
                );
            }

            await next();
        },
    )
}