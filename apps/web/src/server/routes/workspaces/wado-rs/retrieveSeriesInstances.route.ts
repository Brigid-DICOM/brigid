import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { wadoRsHeaderSchema, wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import { SeriesService } from "@/server/services/series.service";
import { MultipartHandler } from "./handlers/multipartHandler";
import { ZipHandler } from "./handlers/zipHandler";

const retrieveSeriesInstancesRoute = new Hono()
.use(cleanupTempFiles)
.get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid",
    describeRoute({
        description: "Retrieve DICOM series instances (WADO-RS), ref: [Retrieve Transaction Series Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
        tags: ["WADO-RS"]
    }),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
        studyInstanceUid: z.string().describe("The study instance UID"),
        seriesInstanceUid: z.string().describe("The series instance UID")
    })),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const seriesInstanceUid = c.req.param("seriesInstanceUid");
        const { accept } = c.req.valid("header") as { accept: string };

        const seriesService = new SeriesService();
        const series = await seriesService.getSeriesByUid({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid
        });
        if (!series) {
            return c.json(
                {
                    message: "Series not found"
                },
                404
            );
        }

        const limit = env.QUERY_MAX_LIMIT;
        let offset = 0;
        const instances: InstanceEntity[] = [];
        let { instances: seriesInstances, hasNextPage } = await seriesService.getSeriesInstances({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            limit,
            offset
        });
        instances.push(...seriesInstances);

        if (instances.length === 0) {
            return c.json(
                {
                    message: `Instances not found, series instance UID: ${seriesInstanceUid}`
                },
                404
            );
        }

        while (hasNextPage) {
            offset += limit;
            const result = await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                offset
            });
            instances.push(...result.instances);
            hasNextPage = result.hasNextPage;
        }

        const handlers = [
            new ZipHandler(),
            new MultipartHandler()
        ];

        const handler = handlers.find((handler) => handler.canHandle(accept));

        if (!handler) {
            return c.json(
                {
                    message: "No handler found for the given accept header"
                },
                406
            );
        }

        return handler.handle(c, { instances, accept: accept });
    }
);

export default retrieveSeriesInstancesRoute;