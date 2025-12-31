import type { Context } from "hono";
import { MultipartHandler } from "@/server/routes/workspaces/wado-rs/handlers/multipartHandler";
import { ZipHandler } from "@/server/routes/workspaces/wado-rs/handlers/zipHandler";
import { DicomAuditService } from "@/server/services/dicom/dicomAudit.service";
import { InstanceService } from "@/server/services/instance.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveInstanceHandler",
});

interface RetrieveInstanceParams {
    workspaceId: string;
    studyInstanceUid: string;
    seriesInstanceUid: string;
    sopInstanceUid: string;
    accept: string;
}

export const retrieveInstanceHandler = async (
    c: Context,
    params: RetrieveInstanceParams,
) => {
    try {
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            accept,
        } = params;

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
                    ok: false,
                    data: null,
                    error: "Instance not found",
                },
                404,
            );
        }

        const handlers = [new ZipHandler(), new MultipartHandler()];

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
        auditService
            .logTransferBegin(c, {
                workspaceId,
                studyInstanceUid,
                instances: [instance],
                name: "RetrieveInstance",
            })
            .then(() => {
                console.info("Transfer begin audit logged");
            })
            .catch((error) => {
                logger.error(
                    `Error logging transfer begin audit, workspaceId: ${workspaceId}, studyInstanceUid: ${studyInstanceUid}, seriesInstanceUid: ${seriesInstanceUid}, sopInstanceUid: ${sopInstanceUid}, sopInstanceUid: ${sopInstanceUid}`,
                    error,
                );
            });

        return handler.handle(c, { instances: [instance], accept: accept });
    } catch (error) {
        logger.error("Error retrieving instance", error);
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
