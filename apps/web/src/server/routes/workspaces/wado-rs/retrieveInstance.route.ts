import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { retrieveInstanceHandler } from "@/server/handlers/wado-rs/retrieveInstance.handler";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";
import { eventLogger } from "@/server/utils/logger";

const retrieveInstanceRoute = new Hono<{
    Variables: { rqId: string };
}>()
    .use(cleanupTempFiles)
    .get(
        "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid",
        describeRoute({
            description:
                "Retrieve DICOM instance (WADO-RS), ref: [Retrieve Transaction Instance Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
            tags: ["WADO-RS"],
        }),
        verifyAuthMiddleware,
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
                sopInstanceUid: z.string().describe("The sop instance UID"),
            }),
        ),
        async (c, next) => {
            const rqId = c.get("rqId");
            const workspaceId = c.req.param("workspaceId");
            const startTime = performance.now();

            eventLogger.info("request received", {
                name: "retrieveInstance",
                requestId: rqId,
                workspaceId,
            });

            await next();

            const elapsedTime = performance.now() - startTime;
            eventLogger.info("request completed", {
                name: "retrieveInstance",
                requestId: rqId,
                elapsedTime,
                workspaceId,
            });
        },
        async (c) => {
            const rqId = c.get("rqId");
            const workspaceId = c.req.param("workspaceId");
            const studyInstanceUid = c.req.param("studyInstanceUid");
            const seriesInstanceUid = c.req.param("seriesInstanceUid");
            const sopInstanceUid = c.req.param("sopInstanceUid");
            const { accept } = c.req.valid("header") as { accept: string };

            try {
                return await retrieveInstanceHandler(c, {
                    workspaceId,
                    studyInstanceUid,
                    seriesInstanceUid,
                    sopInstanceUid,
                    accept,
                });
            } catch (error) {
                eventLogger.error("Error retrieving instance", {
                    name: "retrieveInstance",
                    requestId: rqId,
                    workspaceId,
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

export default retrieveInstanceRoute;
