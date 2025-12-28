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
import { InstanceService } from "@/server/services/instance.service";
import { appLogger, eventLogger } from "@/server/utils/logger";
import { MultipartHandler } from "../handlers/multipartHandler";

const logger = appLogger.child({
    module: "RetrieveRenderedInstancesRoute",
});

const retrieveRenderedInstancesRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/rendered",
    describeRoute({
        description:
            "Retrieve Transaction Rendered Instances, ref: [Retrieve Transaction Rendered Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-3)",
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
            sopInstanceUid: z.string().describe("The sop instance UID"),
        }),
    ),
    zValidator("query", wadoRsQueryParamSchema),
    async (c, next) => {
        const rqId = c.get("rqId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "retrieveRenderedInstance",
            requestId: rqId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "retrieveRenderedInstance",
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

        const instanceService = new InstanceService();
        try {
            const instance = await instanceService.getInstanceByUid({
                workspaceId,
                studyInstanceUid,
                seriesInstanceUid,
                sopInstanceUid,
            });
            if (!instance) {
                return c.json(
                    {
                        message: "Instance not found",
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
            auditService
                .logTransferBegin(c, {
                    workspaceId,
                    studyInstanceUid,
                    instances: [instance],
                    name: "RetrieveRenderedInstance",
                })
                .then(() => {
                    console.info("Transfer begin audit logged");
                })
                .catch((error) => {
                    logger.error(
                        `Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}, sopInstanceUid: ${sopInstanceUid}`,
                        error,
                    );
                });

            return handler.handle(c, { instances: [instance], accept: accept });
        } catch (error) {
            eventLogger.error("Error retrieving rendered instance", {
                name: "retrieveRenderedInstance",
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

export default retrieveRenderedInstancesRoute;
