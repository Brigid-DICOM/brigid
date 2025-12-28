import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { retrieveStudyThumbnailHandler } from "@/server/handlers/wado-rs/thumbnail/retrieveStudyThumbnail.handler";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import { eventLogger } from "@/server/utils/logger";

const retrieveStudyThumbnailRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/thumbnail",
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
        }),
    ),
    async (c, next) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const startTime = performance.now();
        eventLogger.info("request received", {
            name: "retrieveStudyThumbnail",
            requestId: rqId,
            workspaceId,
        });

        await next();
        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "retrieveStudyThumbnail",
            requestId: rqId,
            elapsedTime,
            workspaceId,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const { workspaceId, studyInstanceUid } = c.req.valid("param");
        const { accept } = c.req.valid("header");

        try {
            return await retrieveStudyThumbnailHandler(c, {
                workspaceId,
                studyInstanceUid,
                accept,
            });
        } catch (error) {
            eventLogger.error("Error retrieving study thumbnail", {
                name: "retrieveStudyThumbnail",
                requestId: rqId,
                workspaceId,
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

export default retrieveStudyThumbnailRoute;
