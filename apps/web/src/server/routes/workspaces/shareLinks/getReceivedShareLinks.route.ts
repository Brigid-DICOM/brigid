import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { toApiShareLinkData } from "@/server/dto/shareLink.dto";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import { ShareLinkService } from "@/server/services/shareLink.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "GetReceivedShareLinksRoute",
});

const getReceivedShareLinksRoute = new Hono().get(
    "/share-links/received",
    describeRoute({
        description: "Get all received share links of a user",
        tags: ["Share Links"],
    }),
    verifyAuthMiddleware,
    zValidator(
        "query",
        z.object({
            page: z.coerce
                .number()
                .min(1)
                .default(1)
                .describe("The page number"),
            limit: z.coerce
                .number()
                .min(1)
                .max(100)
                .default(10)
                .describe("The number of items per page"),
        }),
    ),
    async (c) => {
        try {
            const { page, limit } = c.req.valid("query");
            const authUser = c.get("authUser");
            const userId = authUser?.user?.id;

            console.log("userId", userId);

            if (!userId) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Unauthorized",
                    },
                    401,
                );
            }

            const shareLinkService = new ShareLinkService();
            const { shareLinks, hasNextPage, total } =
                await shareLinkService.getUserReceivedShareLinks({
                    userId,
                    page,
                    limit,
                });

            return c.json(
                {
                    ok: true,
                    data: {
                        shareLinks: shareLinks.map(toApiShareLinkData),
                        hasNextPage,
                        total,
                    },
                },
                200,
            );
        } catch (error) {
            logger.error("Get received share links failed", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Get received share links failed",
                },
                500,
            );
        }
    },
);

export default getReceivedShareLinksRoute;
