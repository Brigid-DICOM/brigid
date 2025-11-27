import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { requireShareLinkTargetType } from "@/server/middlewares/shareLinkAccess.middleware";
import { StudyService } from "@/server/services/study.service";
import { appLogger } from "@/server/utils/logger";
import { ThumbnailHandler } from "../workspaces/wado-rs/handlers/thumbnailHandler";

const logger = appLogger.child({
    module: "GetShareStudyThumbnailRoute",
});

const retrieveShareStudyThumbnailRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/thumbnail",
    describeRoute({
        description: "Get thumbnail for a shared study",
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
    requireShareLinkTargetType("study"),
    async (c) => {
        try {
            const workspaceId = c.get("workspaceId");
            const { studyInstanceUid } = c.req.valid("param");

            const studyService = new StudyService();
            const medianInstance = await studyService.getStudyMedianInstance({
                workspaceId,
                studyInstanceUid,
            });

            if (!medianInstance || medianInstance.length === 0) {
                return c.json({ message: "Instance not found" }, 404);
            }

            const numberOfFrames = medianInstance[0]?.numberOfFrames || 1;
            const medianFrameNumber = numberOfFrames >> 1;

            const handler = new ThumbnailHandler();
            const accept = c.req.valid("header").accept || "image/jpeg";

            if (!handler.canHandle(accept)) {
                return c.json(
                    { message: "No handler found for the given accept header" },
                    406,
                );
            }

            return handler.handle(c, {
                instances: medianInstance,
                accept,
                frameNumber: medianFrameNumber,
            });
        } catch (error) {
            logger.error("Error getting share study thumbnail", error);
            return c.json(
                { ok: false, data: null, error: "Internal server error" },
                500,
            );
        }
    },
);

export default retrieveShareStudyThumbnailRoute;
