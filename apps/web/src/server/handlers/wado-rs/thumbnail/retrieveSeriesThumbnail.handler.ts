import type { Context } from "hono";
import { ThumbnailHandler } from "@/server/routes/workspaces/wado-rs/handlers/thumbnailHandler";
import { SeriesService } from "@/server/services/series.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveSeriesThumbnailHandler",
});

export const retrieveSeriesThumbnailHandler = async (
    c: Context,
    options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        accept: string;
    },
) => {
    try {
        const seriesService = new SeriesService();
        const medianInstance = await seriesService.getSeriesMedianInstance({
            workspaceId: options.workspaceId,
            studyInstanceUid: options.studyInstanceUid,
            seriesInstanceUid: options.seriesInstanceUid,
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
        logger.error(`Error retrieving series thumbnail: ${error}`);
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
