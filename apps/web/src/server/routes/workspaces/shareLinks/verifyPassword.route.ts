import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { verifyPasswordSchema } from "@/server/schemas/shareLinkSchema";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "VerifyPasswordRoute",
});

const verifyPasswordRoute = new Hono().post(
    "/share/:token/verify-password",
    describeRoute({
        description: "Verify the password for a share link",
        tags: ["Share Links"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The token of the share link"),
        }),
    ),
    zValidator("json", verifyPasswordSchema),
    async (c) => {
        try {
            const { token } = c.req.valid("param");
            const { password } = c.req.valid("json");

            const shareLinkService = new ShareLinkService();
            const shareLink = await shareLinkService.getShareLinkByToken(token);

            if (!shareLink) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Share link not found",
                    },
                    404,
                );
            }

            if (!shareLink.requiredPassword || !shareLink.passwordHash) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Share link does not require a password",
                    },
                    400,
                );
            }

            const isValid = await shareLinkService.verifyPassword(
                password,
                shareLink.passwordHash,
            );

            if (!isValid) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Invalid password",
                    },
                    401,
                );
            }

            await shareLinkService.incrementAccessCount(shareLink.id);

            return c.json(
                {
                    ok: true,
                    data: {
                        isValid,
                    },
                    error: null,
                },
                200,
            );
        } catch (error) {
            logger.error("Verify password failed", error);

            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Verify password failed",
                },
                500,
            );
        }
    },
);

export default verifyPasswordRoute;
