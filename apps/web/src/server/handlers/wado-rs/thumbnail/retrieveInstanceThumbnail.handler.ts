import type { Context } from "hono";
import { ThumbnailHandler } from "@/server/routes/workspaces/wado-rs/handlers/thumbnailHandler";
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { InstanceService } from "@/server/services/instance.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveInstanceThumbnailHandler",
});

export const retrieveInstanceThumbnailHandler = async (
    c: Context,
    options: {
        workspaceId: string;
        studyInstanceUid: string;
        seriesInstanceUid: string;
        sopInstanceUid: string;
        accept: string;
    },
) => {
    try {
        const instanceService = new InstanceService();
        const instance = await instanceService.getInstanceByUid({
            workspaceId: options.workspaceId,
            studyInstanceUid: options.studyInstanceUid,
            seriesInstanceUid: options.seriesInstanceUid,
            sopInstanceUid: options.sopInstanceUid,
        });

        if (!instance) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Instance not found",
                },
                404,
            );
        }

        const numberOfFrames = instance?.numberOfFrames || 1;
        const medianFrameNumber = numberOfFrames >> 1;

        const handler = new ThumbnailHandler();
        if (!handler.canHandle(options.accept)) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "No handler found for the given accept header",
                },
                406,
            );
        }

        const auditService = new DicomAuditService();
        auditService
            .logTransferBegin(c, {
                workspaceId: options.workspaceId,
                studyInstanceUid: options.studyInstanceUid,
                instances: [instance],
                name: "RetrieveInstanceThumbnail",
            })
            .then(() => {
                console.info("Transfer begin audit logged");
            })
            .catch((error) => {
                logger.error(
                    `Error logging transfer begin audit, workspaceId: ${options.workspaceId}, studyInstanceUid: ${options.studyInstanceUid}, seriesInstanceUid: ${options.seriesInstanceUid}, sopInstanceUid: ${options.sopInstanceUid}`,
                    error,
                );
            });

        return handler.handle(c, {
            instances: [instance],
            accept: options.accept,
            frameNumber: medianFrameNumber,
        });
    } catch (error) {
        logger.error(`Error retrieving instance thumbnail: ${error}`);
        return c.json(
            {
                ok: false,
                data: null,
                error: "Internal server error",
            },
            500,
        );
    }
};
