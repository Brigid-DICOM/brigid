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

        const seriesService = new SeriesService();
        const series = await seriesService.getSeriesByUid({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
        });
        if (!series) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Series not found",
                },
                404,
            );
        }

        const limit = env.QUERY_MAX_LIMIT;
        let offset = 0;
        const instances: InstanceEntity[] = [];
        let { instances: seriesInstances, hasNextPage } =
            await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                offset,
            });
        instances.push(...seriesInstances);

        if (instances.length === 0) {
            return c.json(
                {
                    message: `Instances not found, series instance UID: ${seriesInstanceUid}`,
                },
                404,
            );
        }

        while (hasNextPage) {
            offset += limit;
            const result = await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                offset,
            });
            instances.push(...result.instances);
            hasNextPage = result.hasNextPage;
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
