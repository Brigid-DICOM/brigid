import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import type { Context } from "hono";
import { MultipartHandler } from "@/server/routes/workspaces/wado-rs/handlers/multipartHandler";
import { ZipHandler } from "@/server/routes/workspaces/wado-rs/handlers/zipHandler";
import { StudyService } from "@/server/services/study.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveStudyInstancesHandler",
});

interface RetrieveStudyInstancesParams {
    workspaceId: string;
    studyInstanceUid: string;
    accept: string;
}

export const retrieveStudyInstancesHandler = async (
    c: Context,
    params: RetrieveStudyInstancesParams,
) => {
    try {
        const { workspaceId, studyInstanceUid, accept } = params;

        const studyService = new StudyService();
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

        const limit = env.QUERY_MAX_LIMIT;
        let offset = 0;
        const instances: InstanceEntity[] = [];
        let { instances: studyInstances, hasNextPage } =
            await studyService.getStudyInstances({
                workspaceId,
                studyInstanceUid,
                limit,
                offset,
            });
        instances.push(...studyInstances);

        if (instances.length === 0) {
            return c.json(
                {
                    message: `Instances not found, study instance UID: ${studyInstanceUid}`,
                },
                404,
            );
        }

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

        return handler.handle(c, { instances, accept: accept });
    } catch (error) {
        logger.error("Error retrieving study instances", error);
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
