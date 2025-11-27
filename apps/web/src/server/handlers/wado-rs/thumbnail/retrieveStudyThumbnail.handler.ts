import type { Context } from "hono";
import { ThumbnailHandler } from "@/server/routes/workspaces/wado-rs/handlers/thumbnailHandler";
import { StudyService } from "@/server/services/study.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveStudyThumbnailHandler",
});

export const retrieveStudyThumbnailHandler = async (
    c: Context,
    options: {
        workspaceId: string;
        studyInstanceUid: string;
        accept: string;
    },
) => {
    try {
        const studyService = new StudyService();
        const medianInstance = await studyService.getStudyMedianInstance({
            workspaceId: options.workspaceId,
            studyInstanceUid: options.studyInstanceUid,
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
        if (!handler.canHandle(options.accept)) {
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
            accept: options.accept,
            frameNumber: medianFrameNumber,
        });
    } catch (error) {
        logger.error("Error retrieving study thumbnail", error);
        return c.json(
            {
                ok: false,
                data: null,
                error: "Internal server error",
            },
            500,
        );
    }
};
