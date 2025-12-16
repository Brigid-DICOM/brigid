import env from "@brigid/env";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { ShareLinkService } from "../services/shareLink.service";

const JWT_SECRET = env.JWT_SECRET;

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
            let isPasswordVerified = false;

            // Check cookie first for verified status
            const authCookie = getCookie(c, `share-auth-${token}`);
            if (authCookie) {
                try {
                    const decoded = await verify(authCookie, JWT_SECRET);
                    if (decoded.token === token && decoded.verified) {
                        isPasswordVerified = true;
                    }
                } catch {
                    // Invalid Cookie, continue to check password from query parameter
                }
            }

            if (!isPasswordVerified && password && shareLink.passwordHash) {
                const isValidPassword = await shareLinkService.verifyPassword(
                    password,
                    shareLink.passwordHash,
                );
                isPasswordVerified = isValidPassword;
            }

            if (!isPasswordVerified) {
                if (!password) {
                    return c.json(
                        {
                            ok: false,
                            data: null,
                            error: "Password is required",
                        },
                        403,
                    );
                }
                return c.json(
                    { ok: false, data: null, error: "Invalid password" },
                    401,
                );
            }
        }

        c.set("shareLink", shareLink);
        c.set("workspaceId", shareLink.workspaceId);

        await next();
    },
);
