import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifyStudyInShareLink } from "@/server/middlewares/shareLinkAccess.middleware";
import { MultipartHandler } from "@/server/routes/workspaces/wado-rs/handlers/multipartHandler";
import { ZipHandler } from "@/server/routes/workspaces/wado-rs/handlers/zipHandler";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";
import { StudyService } from "@/server/services/study.service";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "RetrieveShareStudyInstancesRoute",
});

const retrieveShareStudyInstancesRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid",
    describeRoute({
        description:
            "Retrieve DICOM study instances (WADO-RS) for shared content",
        tags: ["Share Links - Public"],
    }),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            studyInstanceUid: z.string().describe("The study instance UID"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifyStudyInShareLink,
    async (c) => {
        try {
            const workspaceId = c.get("workspaceId");
            const { studyInstanceUid } = c.req.valid("param");
            const { accept } = c.req.valid("header");

            const studyService = new StudyService();
            const study = await studyService.getStudyByUid({
                workspaceId,
                studyInstanceUid,
            });
            if (!study) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Study not found",
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

            const handler = handlers.find((handler) =>
                handler.canHandle(accept),
            );

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
            logger.error("Error retrieving share study instances", error);
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

export default retrieveShareStudyInstancesRoute;
