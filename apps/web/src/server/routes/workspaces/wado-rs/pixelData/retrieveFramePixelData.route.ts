import type { ReadStream } from "node:fs";
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
import { numberQuerySchema } from "@/server/schemas/numberQuerySchema";
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { InstanceService } from "@/server/services/instance.service";
import type { DicomSource } from "@/server/types/dicom/convert";
import { getDicomToImageConverter } from "@/server/utils/dicom/converter/converterFactory";
import { toConvertOptions } from "@/server/utils/dicom/converter/convertOptions";
import { appLogger, eventLogger } from "@/server/utils/logger";
import multipartMessage from "@/server/utils/multipartMessage";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";

const logger = appLogger.child({
    module: "RetrieveFramePixelDataRoute",
});

const retrieveFramePixelDataRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frameNumbers",
    describeRoute({
        description:
            "Retrieve frame pixel data (WADO-RS), ref: [ Retrieve Transaction Pixel Data Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1.6-1)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "header",
        z.object({
            accept: z.enum([
                'multipart/related; type="application/octet-stream"',
                "*/*",
            ]),
        }),
    ),
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
    async (c, next) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "retrieveFramePixelData",
            requestId: rqId,
            workspaceId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "retrieveFramePixelData",
            requestId: rqId,
            elapsedTime,
            workspaceId,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            frameNumbers,
        } = c.req.valid("param");

        try {
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
    
            const auditService = new DicomAuditService();
            auditService.logTransferBegin(c, {
                workspaceId,
                studyInstanceUid,
                instances: [instance],
                name: "RetrieveFramePixelData",
            }).then(() => {
                console.info("Transfer begin audit logged");
            }).catch((error) => {
                logger.error(`Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}, sopInstanceUid: ${sopInstanceUid}, frameNumbers: ${frameNumbers}`, error);
            });
    
            const storage = getStorageProvider();
            const { body } = await storage.downloadFile(instance.instancePath);
    
            const converter = getDicomToImageConverter("raw");
            const results: {
                stream: ReadStream;
                size?: number;
                contentLocation?: string;
            }[] = [];
            const frames = frameNumbers.split(",").map(Number);
    
            for (const frame of frames) {
                const convertOptions = toConvertOptions({
                    ...c.req.query(),
                });
    
                convertOptions.frameNumber = frame;
    
                const source: DicomSource = { kind: "stream", stream: body };
                const result = await converter.convert(source, convertOptions);
                results.push({
                    stream: result.frames[0].stream,
                    size: result.frames[0].size,
                    contentLocation:
                        `${env.NEXT_PUBLIC_APP_URL}/api/workspaces/${instance.workspaceId}` +
                        `/studies/${instance.studyInstanceUid}` +
                        `/series/${instance.seriesInstanceUid}` +
                        `/instances/${instance.sopInstanceUid}` +
                        `/frames/${frame}`,
                });
            }
    
            const multipart = multipartMessage.multipartEncodeByStream(
                results,
                undefined, // default to use guid boundary
                "application/octet-stream",
            );
    
            // @ts-expect-error
            return new Response(multipart.data, {
                headers: {
                    "Content-Type": `multipart/related; type="application/octet-stream"; boundary=${multipart.boundary}`,
                },
            });
        } catch (error) {
            eventLogger.error("Error retrieving frame pixel data", {
                name: "retrieveFramePixelData",
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

export default retrieveFramePixelDataRoute;
