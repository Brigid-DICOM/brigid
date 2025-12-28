import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { retrieveInstanceThumbnailHandler } from "@/server/handlers/wado-rs/thumbnail/retrieveInstanceThumbnail.handler";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import { eventLogger } from "@/server/utils/logger";

const retrieveInstanceThumbnailRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/thumbnail",
    describeRoute({
        description:
            "Thumbnail Resources (defined in [Table 10.4.1-4](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-4)) are used to retrieve a rendered representation appropriate to stand for its parent DICOM Resource.",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "header",
        z.object({
            accept: z.enum(["image/jpeg", "*/*"]),
        }),
    ),
    zValidator(
        "query",
        wadoRsQueryParamSchema.pick({
            viewport: true,
        }),
    ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
            sopInstanceUid: z.string().describe("The sop instance UID"),
        }),
    ),
    async (c, next) => {
        const rqId = c.get("rqId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "retrieveInstanceThumbnail",
            requestId: rqId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "retrieveInstanceThumbnail",
            requestId: rqId,
            elapsedTime,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        } = c.req.valid("param");

        const accept = c.req.valid("header").accept;

        try {
            return await retrieveInstanceThumbnailHandler(c, {
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
                accept,
            });
        } catch (error) {
            eventLogger.error("Error retrieving instance thumbnail", {
                name: "retrieveInstanceThumbnail",
                requestId: rqId,
                error: error instanceof Error ? error.message : String(error),
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

export default retrieveInstanceThumbnailRoute;
