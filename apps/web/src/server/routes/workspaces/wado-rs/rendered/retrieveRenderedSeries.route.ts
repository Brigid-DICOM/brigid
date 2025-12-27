import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import {
    wadoRsMultipleFramesHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { SeriesService } from "@/server/services/series.service";
import { appLogger } from "@/server/utils/logger";
import { MultipartHandler } from "../handlers/multipartHandler";

const logger = appLogger.child({
    module: "RetrieveRenderedSeriesRoute",
});

const retrieveRenderedSeriesRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/rendered",
    describeRoute({
        description:
            "Retrieve Transaction Rendered Series, ref: [Retrieve Transaction Rendered Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-3)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator("header", wadoRsMultipleFramesHeaderSchema),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
        }),
    ),
    zValidator("query", wadoRsQueryParamSchema),
    async (c) => {
        const { workspaceId, studyInstanceUid, seriesInstanceUid } =
            c.req.valid("param");
        const accept = c.req.valid("header").accept;

        const seriesService = new SeriesService();
        const seriesInstances: InstanceEntity[] = [];

        let offset = 0;
        const { instances, hasNextPage } =
            await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit: env.QUERY_MAX_LIMIT,
                offset: 0,
            });
        seriesInstances.push(...instances);

        while (hasNextPage) {
            offset += env.QUERY_MAX_LIMIT;
            const result = await seriesService.getSeriesInstances({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                limit: env.QUERY_MAX_LIMIT,
                offset,
            });
            seriesInstances.push(...result.instances);
        }

        if (seriesInstances.length === 0) {
            return c.json(
                {
                    message: `Series instances not found, series instance UID: ${seriesInstanceUid}`,
                },
                404,
            );
        }

        const handler = new MultipartHandler();
        if (!handler.canHandle(accept)) {
            return c.json(
                {
                    message: "No handler found for the given accept header",
                },
                406,
            );
        }

        const auditService = new DicomAuditService();
        auditService.logTransferBegin(c, {
            workspaceId,
            studyInstanceUid,
            instances: seriesInstances,
            name: "RetrieveRenderedSeries",
        }).then(() => {
            console.info("Transfer begin audit logged");
        }).catch((error) => {
            logger.error(`Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}`, error);
        });

        return handler.handle(c, {
            instances: seriesInstances,
            accept: accept,
        });
    },
);

export default retrieveRenderedSeriesRoute;
