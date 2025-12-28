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
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { parseFromFilename } from "@/server/services/dicom/dicomJsonParser";
import { StudyService } from "@/server/services/study.service";
import { DicomJsonBinaryDataUtils } from "@/server/utils/dicom/dicomJsonBinaryDataUtils";
import { appLogger, eventLogger } from "@/server/utils/logger";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";

const logger = appLogger.child({
    module: "RetrieveStudyMetadataRoute",
});

const retrieveStudyMetadataRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/metadata",
    describeRoute({
        description:
            "Retrieve Study Metadata (WADO-RS), ref: [Retrieve Transaction Metadata Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-2)",
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
        }),
    ),
    async (c, next) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "retrieveStudyMetadata",
            requestId: rqId,
            workspaceId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "retrieveStudyMetadata",
            requestId: rqId,
            elapsedTime,
            workspaceId,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const { workspaceId, studyInstanceUid } = c.req.valid("param");

        const studyService = new StudyService();
        try {
            const study = await studyService.getStudyByUid({
                workspaceId,
                studyInstanceUid,
            });
            if (!study) {
                return c.json(
                    {
                        message: "Study not found",
                    },
                    404,
                );
            }
    
            let offset = 0;
            const limit = env.QUERY_MAX_LIMIT;
    
            const instances: InstanceEntity[] = [];
            let { instances: studyInstances, hasNextPage } =
                await studyService.getStudyInstances({
                    workspaceId,
                    studyInstanceUid,
                    limit,
                    offset,
                });
            instances.push(...studyInstances);
    
            while (hasNextPage) {
                offset += limit;
                const result = await studyService.getStudyInstances({
                    workspaceId,
                    studyInstanceUid,
                    limit,
                    offset,
                });
                instances.push(...result.instances);
                hasNextPage = result.hasNextPage;
            }
    
            if (instances.length === 0) {
                return c.json(
                    {
                        message: `Study instances not found, study instance UID: ${studyInstanceUid}`,
                    },
                    404,
                );
            }
    
            const auditService = new DicomAuditService();
            auditService.logTransferBegin(c, {
                workspaceId,
                studyInstanceUid,
                instances,
                name: "RetrieveStudyMetadata",
            }).then(() => {
                console.info("Transfer begin audit logged");
            }).catch((error) => {
                logger.error(`Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}`, error);
            });
    
            const metadata = [];
            for (const instance of instances) {
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
        } catch (error) {
            eventLogger.error("Error retrieving study metadata", {
                name: "retrieveStudyMetadata",
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

export default retrieveStudyMetadataRoute;
