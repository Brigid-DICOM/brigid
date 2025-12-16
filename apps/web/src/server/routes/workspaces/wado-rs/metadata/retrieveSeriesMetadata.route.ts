import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import fsE from "fs-extra";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import tmp from "tmp";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { parseFromFilename } from "@/server/services/dicom/dicomJsonParser";
import { SeriesService } from "@/server/services/series.service";
import { DicomJsonBinaryDataUtils } from "@/server/utils/dicom/dicomJsonBinaryDataUtils";
import { appLogger } from "@/server/utils/logger";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";

const logger = appLogger.child({
    module: "RetrieveSeriesMetadataRoute",
});

const retrieveSeriesMetadataRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/metadata",
    describeRoute({
        description:
            "Retrieve Series Metadata (WADO-RS), ref: [Retrieve Transaction Metadata Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-2)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
        }),
    ),
    async (c) => {
        const { workspaceId, studyInstanceUid, seriesInstanceUid } =
            c.req.valid("param");

        const seriesService = new SeriesService();
        const series = await seriesService.getSeriesByUid({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
        });
        if (!series) {
            return c.json(
                {
                    message: "Series not found",
                },
                404,
            );
        }

        let offset = 0;
        const limit = env.QUERY_MAX_LIMIT;

        const seriesInstances: InstanceEntity[] = [];
        let { instances, hasNextPage } = await seriesService.getSeriesInstances(
            {
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                offset,
            },
        );
        seriesInstances.push(...instances);

        while (hasNextPage) {
            offset += limit;
            const result = await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit,
                offset,
            });
            seriesInstances.push(...result.instances);
            hasNextPage = result.hasNextPage;
        }

        if (seriesInstances.length === 0) {
            return c.json(
                {
                    message: `Series instances not found, series instance UID: ${seriesInstanceUid}`,
                },
                404,
            );
        }

        const metadata = [];
        for (const instance of seriesInstances) {
            const storage = getStorageProvider();
            const { body } = await storage.downloadFile(instance.instancePath);

            const tempFile = tmp.fileSync();
            await pipeline(body, createWriteStream(tempFile.name));

            const dicomJson = await parseFromFilename(tempFile.name);

            const dicomJsonBinaryDataUtils = new DicomJsonBinaryDataUtils(
                dicomJson,
                workspaceId,
            );
            dicomJsonBinaryDataUtils.replaceBinaryPropsToUriProp();

            metadata.push(dicomJson);
            fsE.remove(tempFile.name)
                .then(() => {
                    logger.info(
                        `Deleted temp file successfully: ${tempFile.name}`,
                    );
                })
                .catch();
        }

        return c.json(metadata);
    },
);

export default retrieveSeriesMetadataRoute;
