import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
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
import { InstanceService } from "@/server/services/instance.service";
import { DicomJsonBinaryDataUtils } from "@/server/utils/dicom/dicomJsonBinaryDataUtils";
import { appLogger } from "@/server/utils/logger";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";

const logger = appLogger.child({
    module: "RetrieveInstanceMetadataRoute",
});

const retrieveInstanceMetadataRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/metadata",
    describeRoute({
        description:
            "Retrieve Instance Metadata (WADO-RS), ref: [Retrieve Transaction Metadata Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-2)",
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
            seriesInstanceUid: z.string().describe("The series instance UID"),
            sopInstanceUid: z.string().describe("The sop instance UID"),
        }),
    ),
    async (c) => {
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
        } = c.req.valid("param");

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
            name: "RetrieveInstanceMetadata",
        }).then(() => {
            console.info("Transfer begin audit logged");
        }).catch((error) => {
            logger.error(`Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}, sopInstanceUid: ${sopInstanceUid}`, error);
        });

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

        fsE.remove(tempFile.name)
            .then(() => {
                logger.info(`Deleted temp file successfully: ${tempFile.name}`);
            })
            .catch();
        return c.json(dicomJson);
    },
);

export default retrieveInstanceMetadataRoute;
