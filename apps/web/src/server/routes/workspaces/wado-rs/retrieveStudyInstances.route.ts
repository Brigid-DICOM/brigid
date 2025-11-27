import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { retrieveStudyInstancesHandler } from "@/server/handlers/wado-rs/retrieveStudyInstances.handler";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { wadoRsHeaderSchema, wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";

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
        studyInstanceUid: z.string().describe("The study instance UID"),
        aaa: z.string().optional()
    })),
    async (c) => {
        const { workspaceId, studyInstanceUid } = c.req.valid("param");
        const { accept } = c.req.valid("header");

        return await retrieveStudyInstancesHandler(c, {
            workspaceId,
            studyInstanceUid,
            accept,
        });
    }
);

export default retrieveStudyInstancesRoute;