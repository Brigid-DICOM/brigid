import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { retrieveSeriesInstancesHandler } from "@/server/handlers/wado-rs/retrieveSeriesInstances.handler";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";
import { eventLogger } from "@/server/utils/logger";

const retrieveSeriesInstancesRoute = new Hono<{
    Variables: { rqId: string };
}>()
    .use(cleanupTempFiles)
    .get(
        "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid",
        describeRoute({
            description:
                "Retrieve DICOM series instances (WADO-RS), ref: [Retrieve Transaction Series Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
            tags: ["WADO-RS"],
        }),
        verifyAuthMiddleware,
        verifyWorkspaceExists,
        verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
        zValidator("header", wadoRsHeaderSchema),
        zValidator("query", wadoRsQueryParamSchema),
        zValidator(
            "param",
            z.object({
                workspaceId: z.string().describe("The ID of the workspace"),
                studyInstanceUid: z.string().describe("The study instance UID"),
                seriesInstanceUid: z
                    .string()
                    .describe("The series instance UID"),
            }),
        ),
        async (c, next) => {
            const rqId = c.get("rqId");
            const startTime = performance.now();

            eventLogger.info("request received", {
                name: "retrieveSeries",
                requestId: rqId,
            });

            await next();

            const elapsedTime = performance.now() - startTime;
            eventLogger.info("request completed", {
                name: "retrieveSeries",
                requestId: rqId,
                elapsedTime,
            });
        },
        async (c) => {
            const rqId = c.get("rqId");
            const workspaceId = c.req.param("workspaceId");
            const studyInstanceUid = c.req.param("studyInstanceUid");
            const seriesInstanceUid = c.req.param("seriesInstanceUid");
            const { accept } = c.req.valid("header") as { accept: string };

            try {
                return await retrieveSeriesInstancesHandler(c, {
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                    accept,
                });
            } catch (error) {
                eventLogger.error("Error retrieving series", {
                    name: "retrieveSeries",
                    requestId: rqId,
                    error:
                        error instanceof Error ? error.message : String(error),
                });
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Internal server error",
                    },
                    500,
                );
            }
        },
    );

export default retrieveSeriesInstancesRoute;
