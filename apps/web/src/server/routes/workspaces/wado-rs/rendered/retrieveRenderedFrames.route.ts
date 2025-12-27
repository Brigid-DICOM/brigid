import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { numberQuerySchema } from "@/server/schemas/numberQuerySchema";
import {
    wadoRsMultipleFramesHeaderSchema,
    wadoRsQueryParamSchema,
    wadoRsRenderedFramesHeaderSchema,
    wadoRsSingleFrameHeaderSchema,
} from "@/server/schemas/wadoRs";
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { InstanceService } from "@/server/services/instance.service";
import { appLogger } from "@/server/utils/logger";
import { MultipartHandler } from "../handlers/multipartHandler";
import { SingleFrameHandler } from "../handlers/singleFrameHandler";

const logger = appLogger.child({
    module: "RetrieveRenderedFramesRoute",
});

const retrieveRenderedFramesRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frameNumbers/rendered",
    describeRoute({
        description:
            "Retrieve Transaction Rendered Frames, ref: [Retrieve Transaction Rendered Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-3)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator("header", wadoRsRenderedFramesHeaderSchema),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
            sopInstanceUid: z.string().describe("The sop instance UID"),
            frameNumbers: numberQuerySchema.describe(
                "a comma-separated list of Frame numbers, in ascending order, contained within an Instance.",
            ),
        }),
    ),
    zValidator("query", wadoRsQueryParamSchema),
    async (c) => {
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            frameNumbers,
        } = c.req.valid("param");
        const accept = c.req.valid("header").accept;

        const frameCount = frameNumbers.split(",").length;

        // Validate accept header based on frame count
        const headerSchema =
            frameCount === 1
                ? wadoRsSingleFrameHeaderSchema
                : wadoRsMultipleFramesHeaderSchema;

        const result = headerSchema.safeParse({ accept });
        if (!result.success) {
            return c.json(
                {
                    data: { accept },
                    error: result.error.issues,
                    success: false,
                },
                400,
            );
        }

        const instanceService = new InstanceService();
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

        const handlers =
            frameCount === 1
                ? [new SingleFrameHandler()]
                : [new MultipartHandler()];

        const handler = handlers.find((handler) => handler.canHandle(accept));
        if (!handler) {
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
            instances: [instance],
            name: "RetrieveRenderedFrames",
        }).then(() => {
            console.info("Transfer begin audit logged");
        }).catch((error) => {
            logger.error(`Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}, sopInstanceUid: ${sopInstanceUid}, frameNumbers: ${frameNumbers}`, error);
        });

        return handler.handle(c, { instances: [instance], accept: accept });
    },
);

export default retrieveRenderedFramesRoute;
