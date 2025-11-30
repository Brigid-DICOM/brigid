import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import type { Context } from "hono";
import { MultipartHandler } from "@/server/routes/workspaces/wado-rs/handlers/multipartHandler";
import { ZipHandler } from "@/server/routes/workspaces/wado-rs/handlers/zipHandler";
import { SeriesService } from "@/server/services/series.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveSeriesInstancesHandler",
});

interface RetrieveSeriesInstancesParams {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    accept: string;
}

export const retrieveSeriesInstancesHandler = async (
    c: Context,
    params: RetrieveSeriesInstancesParams,
) => {
    try {
        const { workspaceId, studyInstanceUid, seriesInstanceUid, accept } =
            params;
        const limit = env.QUERY_MAX_LIMIT;

        const instances: InstanceEntity[] = [];
        let batch: InstanceEntity[] = [];
        
        let lastUpdatedAt: Date | undefined;
        let lastId: string | undefined;
        let keepPaging = true;
        
        const seriesService = new SeriesService();
        batch = await seriesService.getSeriesInstancesByCursor({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            limit,
            lastUpdatedAt,
            lastId,
        });
        
        if (batch.length === 0) {
            return c.json(
                {
                    message: `Instances not found, series instance UID: ${seriesInstanceUid}`,
                },
                404,
            );
        }

        instances.push(...batch);

        if (batch.length === limit) {
            const lastInstance = batch[batch.length - 1];
            lastUpdatedAt = lastInstance.updatedAt;
            lastId = lastInstance.id;
        } else {
            keepPaging = false;
        }

        while (keepPaging) {
            const nextBatch = await seriesService.getSeriesInstancesByCursor({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                lastUpdatedAt,
                lastId,
            });

            if (nextBatch.length < limit) {
                keepPaging = false;
            }

            if (nextBatch.length > 0) {
                instances.push(...nextBatch);
                const lastInstance = nextBatch[nextBatch.length - 1];
                lastUpdatedAt = lastInstance.updatedAt;
                lastId = lastInstance.id;
            } else {
                keepPaging = false;
            }
        }

        const handlers = [new ZipHandler(), new MultipartHandler()];

        const handler = handlers.find((handler) => handler.canHandle(accept));

        if (!handler) {
            return c.json(
                {
                    message: "No handler found for the given accept header",
                },
                406,
            );
        }

        return handler.handle(c, { instances, accept: accept });
    } catch (error) {
        logger.error("Error retrieving series instances", error);
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
