import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { retrieveSeriesInstancesHandler } from "@/server/handlers/wado-rs/retrieveSeriesInstances.handler";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import { verifyWorkspaceExists, verifyWorkspacePermission } from "@/server/middlewares/workspace.middleware";
import { wadoRsHeaderSchema, wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";

const retrieveSeriesInstancesRoute = new Hono()
.use(cleanupTempFiles)
.get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid",
    describeRoute({
        description: "Retrieve DICOM series instances (WADO-RS), ref: [Retrieve Transaction Series Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
        tags: ["WADO-RS"]
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
        studyInstanceUid: z.string().describe("The study instance UID"),
        seriesInstanceUid: z.string().describe("The series instance UID")
    })),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const seriesInstanceUid = c.req.param("seriesInstanceUid");
        const { accept } = c.req.valid("header") as { accept: string };

        return await retrieveSeriesInstancesHandler(c, {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            accept
        });
    }
);

export default retrieveSeriesInstancesRoute;