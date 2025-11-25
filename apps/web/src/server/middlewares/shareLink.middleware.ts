import { createMiddleware } from "hono/factory";
import { ShareLinkService } from "../services/shareLink.service";

interface ShareLinkEnv {
    Variables: {
        shareLink: Awaited<ReturnType<ShareLinkService["getShareLinkByToken"]>>;
        workspaceId: string;
    };
}

export const verifyShareLinkToken = createMiddleware<ShareLinkEnv>(
    async (c, next) => {
        const token = c.req.param("token");
        const password = c.req.query("password");
        const authUser = c.get("authUser");
        const userId = authUser?.user?.id;

        if (!token) {
            return c.json(
                { ok: false, data: null, error: "Token is required" },
                400,
            );
        }

        const shareLinkService = new ShareLinkService();
        const shareLink = await shareLinkService.getShareLinkByToken(token);

        if (!shareLink) {
            return c.json(
                { ok: false, data: null, error: "Share link not found" },
                404,
            );
        }

        const accessResult = await shareLinkService.verifyAccess({
            shareLinkId: shareLink.id,
            userId,
        });

        if (!accessResult.allowed) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: accessResult.reason || "Access denied",
                },
                403,
            );
        }

        if (shareLink.requiredPassword) {
            if (!password) {
                return c.json(
                    { ok: false, data: null, error: "Password is required" },
                    403,
                );
            }

            if (shareLink.passwordHash) {
                const isValidPassword = await shareLinkService.verifyPassword(
                    password,
                    shareLink.passwordHash,
                );

                if (!isValidPassword) {
                    return c.json(
                        { ok: false, data: null, error: "Invalid password" },
                        401,
                    );
                }
            }
        }

        c.set("shareLink", shareLink);
        c.set("workspaceId", shareLink.workspaceId);

        await next();
    },
);
