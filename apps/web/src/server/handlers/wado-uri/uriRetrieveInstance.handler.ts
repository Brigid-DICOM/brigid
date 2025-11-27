import type { Context } from "hono";
import { SingleInstanceHandler } from "@/server/routes/workspaces/wado-rs/handlers/singleInstanceHandler";
import { InstanceService } from "@/server/services/instance.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "UriRetrieveInstanceHandler",
});

export const uriRetrieveInstanceHandler = async (
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
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            accept,
        } = options;

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

        const handler = new SingleInstanceHandler();
        if (!handler.canHandle(accept)) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "No handler found for the given accept header",
                },
                406,
            );
        }

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
