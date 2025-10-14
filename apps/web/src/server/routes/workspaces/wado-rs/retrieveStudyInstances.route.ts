import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import env from "@brigid/env";
import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { wadoRsHeaderSchema, wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";
import { StudyService } from "@/server/services/study.service";
import { MultipartHandler } from "./handlers/multipartHandler";
import { ZipHandler } from "./handlers/zipHandler";

const retrieveStudyInstancesRoute = new Hono()
.use(cleanupTempFiles)
.get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid",
    describeRoute({
        description: "Retrieve DICOM study instances (WADO-RS), ref: [Retrieve Transaction Study Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
        tags: ["WADO-RS"]
    }),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
        studyInstanceUid: z.string().describe("The study instance UID")
    })),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const { accept } = c.req.valid("header") as { accept: string };

        const studyService = new StudyService();
        const study = await studyService.getStudyByUid({
            workspaceId,
            studyInstanceUid
        });
        if (!study) {
            return c.json(
                {
                    message: "Study not found"
                },
                404
            );
        }

        const limit = env.QUERY_MAX_LIMIT;
        let offset = 0;
        const instances: InstanceEntity[] = [];
        let { instances: studyInstances, hasNextPage } = await studyService.getStudyInstances({
            workspaceId,
            studyInstanceUid,
            limit,
            offset
        });
        instances.push(...studyInstances);

        if (instances.length === 0) {
            return c.json(
                {
                    message: `Instances not found, study instance UID: ${studyInstanceUid}`
                },
                404
            );
        }

        while (hasNextPage) {
            offset += limit;
            const result = await studyService.getStudyInstances({
                workspaceId,
                studyInstanceUid,
                limit,
                offset
            });
            instances.push(...result.instances);
            hasNextPage = result.hasNextPage;
        }

        const handlers = [
            new ZipHandler(),
            new MultipartHandler()
        ];

        const handler = handlers.find((handler) => handler.canHandle(accept));

        if (!handler) {
            return c.json(
                {
                    message: "No handler found for the given accept header"
                },
                406
            );
        }

        return handler.handle(c, { instances, accept: accept });
    }
);

export default retrieveStudyInstancesRoute;