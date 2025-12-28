import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { retrieveStudyInstancesHandler } from "@/server/handlers/wado-rs/retrieveStudyInstances.handler";
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

const retrieveStudyInstancesRoute = new Hono<{
    Variables: { rqId: string };
}>()
    .use(cleanupTempFiles)
    .get(
        "/workspaces/:workspaceId/studies/:studyInstanceUid",
        describeRoute({
            description:
                "Retrieve DICOM study instances (WADO-RS), ref: [Retrieve Transaction Study Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
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
            }),
        ),
        async (c, next) => {
            const rqId = c.get("rqId");
            const workspaceId = c.req.param("workspaceId");
            const startTime = performance.now();

            eventLogger.info("request received", {
                name: "retrieveStudy",
                requestId: rqId,
                workspaceId,
            });

            await next();

            const elapsedTime = performance.now() - startTime;
            eventLogger.info("request completed", {
                name: "retrieveStudy",
                requestId: rqId,
                workspaceId,
                elapsedTime,
            });
        },
        async (c) => {
            const rqId = c.get("rqId");
            const { workspaceId, studyInstanceUid } = c.req.valid("param");
            const { accept } = c.req.valid("header");

            try {
                return await retrieveStudyInstancesHandler(c, {
                    workspaceId,
                    studyInstanceUid,
                    accept,
                });
            } catch (error) {
                eventLogger.error("Error retrieving study", {
                    name: "retrieveStudy",
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

export default retrieveStudyInstancesRoute;
