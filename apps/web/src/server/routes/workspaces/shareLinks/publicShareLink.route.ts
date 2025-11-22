import { Hono } from "hono";
import { 
    describeRoute, 
    validator as zValidator 
} from "hono-openapi";
import z from "zod";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "PublicShareLinkRoute",
});

const publicShareLinkRoute = new Hono().get(
    "/share/:token",
    describeRoute({
        description: "Get a public share link",
        tags: ["Share Links - Public"]
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The token of share link")
        })
    ),
    zValidator(
        "query",
        z.object({
            password: z.string().optional().describe("The password of share link")
        })
    ),
    async (c) => {
        try {
            const { token } = c.req.valid("param");
            const { password } = c.req.valid("query");
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            const shareLinkService = new ShareLinkService();
            const shareLink = await shareLinkService.getShareLinkByToken(token);

            if (!shareLink) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Share link not found",
                    },
                    404
                )
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
                    403
                )
            }

            if (shareLink.requiredPassword && !password) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Password is required"
                    },
                    403
                );
            }

            if (shareLink.requiredPassword && password && shareLink.passwordHash) {
                const isValidPassword = await shareLinkService.verifyPassword(
                    password,
                    shareLink.passwordHash
                );

                if (!isValidPassword) {
                    return c.json(
                        {
                            ok: false,
                            data: null,
                            error: "Invalid password"
                        },
                        401
                    );
                }
            }

            const shareDetails = await shareLinkService.getShareLinkDetails(
                shareLink.id
            );

            if (!shareDetails) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Failed to get share link details",
                    },
                    500
                );
            }

            await shareLinkService.incrementAccessCount(shareLink.id);

            return c.json(
                {
                    ok: true,
                    data: {
                        id: shareDetails.id,
                        token: shareLink.token,
                        targetType: shareDetails.targets[0]?.targetType,
                        description: shareDetails.description,
                        accessCount: shareDetails.accessCount,
                        lastAccessedAt: shareDetails.lastAccessedAt,
                        expiresAt: shareDetails.expiresAt,
                        targets: shareDetails.targets.map((target) => ({
                            targetType: target.targetType,
                            targetId: target.targetId,
                            resource: target.resource
                        }))
                    },
                    error: null
                },
                200
            );
        } catch (error) {
            logger.error("Get public share link failed", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get public share link",
                },
                500
            )
        }
    }
)

export default publicShareLinkRoute;