import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { retrieveInstanceHandler } from "@/server/handlers/wado-rs/retrieveInstance.handler";
import { cleanupTempFiles } from "@/server/middlewares/cleanupTempFiles.middleware";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";

const retrieveInstanceRoute = new Hono().use(cleanupTempFiles).get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid",
    describeRoute({
        description:
            "Retrieve DICOM instance (WADO-RS), ref: [Retrieve Transaction Instance Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
        tags: ["WADO-RS"],
    }),
    verifyAuthMiddleware,
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
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
        const workspaceId = c.req.param("workspaceId");
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const seriesInstanceUid = c.req.param("seriesInstanceUid");
        const sopInstanceUid = c.req.param("sopInstanceUid");
        const { accept } = c.req.valid("header") as { accept: string };

        return await retrieveInstanceHandler(c, {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            accept,
        });
    },
);

export default retrieveInstanceRoute;
