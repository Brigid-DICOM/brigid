import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifySeriesInstancesAccess } from "@/server/middlewares/shareLinkAccess.middleware";
import { SeriesService } from "@/server/services/series.service";
import { appLogger } from "@/server/utils/logger";
import { ThumbnailHandler } from "../workspaces/wado-rs/handlers/thumbnailHandler";

const logger = appLogger.child({
    module: "GetShareSeriesThumbnailRoute",
});

const retrieveShareSeriesThumbnailRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/series/:seriesInstanceUid/thumbnail",
    describeRoute({
        description: "Get thumbnail for a shared series",
        tags: ["Share Links - Public"],
    }),
    zValidator(
        "header",
        z.object({
            accept: z.enum(["image/jpeg", "*/*"]).default("image/jpeg"),
        }),
    ),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The token of the share link"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
        }),
    ),
    zValidator(
        "query",
        z.object({
            password: z
                .string()
                .optional()
                .describe("Password for protected share link"),
            viewport: z
                .string()
                .optional()
                .default("64,64")
                .describe("Viewport for the thumbnail, viewport=vw,vh"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifySeriesInstancesAccess,
    async (c) => {
        try {
            const workspaceId = c.get("workspaceId");
            const { studyInstanceUid, seriesInstanceUid } =
                c.req.valid("param");

            const seriesService = new SeriesService();
            const medianInstance = await seriesService.getSeriesMedianInstance({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
            });

            if (!medianInstance || medianInstance.length === 0) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Instance not found",
                    },
                    404,
                );
            }

            const numberOfFrames = medianInstance[0]?.numberOfFrames || 1;
            const medianFrameNumber = numberOfFrames >> 1;

            const handler = new ThumbnailHandler();
            const accept = c.req.valid("header").accept || "image/jpeg";

            if (!handler.canHandle(accept)) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "No handler found for the given accept header",
                    },
                    406,
                );
            }

            return handler.handle(c, {
                instances: medianInstance,
                accept,
                frameNumber: medianFrameNumber,
            });
        } catch (error) {
            logger.error("Error getting share series thumbnail", error);
            return c.json(
                { ok: false, data: null, error: "Internal server error" },
                500,
            );
        }
    },
);

export default retrieveShareSeriesThumbnailRoute;
