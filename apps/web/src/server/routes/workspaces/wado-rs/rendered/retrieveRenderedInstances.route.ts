import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import { verifyWorkspaceExists, verifyWorkspacePermission } from "@/server/middlewares/workspace.middleware";
import {
    wadoRsMultipleFramesHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";
import { InstanceService } from "@/server/services/instance.service";
import { MultipartHandler } from "../handlers/multipartHandler";

const retrieveRenderedInstancesRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/rendered",
    describeRoute({
        description:
            "Retrieve Transaction Rendered Instances, ref: [Retrieve Transaction Rendered Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-3)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator("header", wadoRsMultipleFramesHeaderSchema),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
        studyInstanceUid: z.string().describe("The study instance UID"),
        seriesInstanceUid: z.string().describe("The series instance UID"),
        sopInstanceUid: z.string().describe("The sop instance UID"),
    })),
    zValidator("query", wadoRsQueryParamSchema),
    async (c) => {
        const { workspaceId, studyInstanceUid, seriesInstanceUid, sopInstanceUid } = c.req.valid("param");
        const accept = c.req.valid("header").accept;

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

        const handler = new MultipartHandler();
        if (!handler.canHandle(accept)) {
            return c.json(
                {
                    message: "No handler found for the given accept header",
                },
                406,
            );
        }

        return handler.handle(c, { instances: [instance], accept: accept });
    }
)

export default retrieveRenderedInstancesRoute;