import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import { z } from "zod";
import { retrieveInstanceThumbnailHandler } from "@/server/handlers/wado-rs/thumbnail/retrieveInstanceThumbnail.handler";
import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";

const retrieveInstanceThumbnailRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/thumbnail",
    describeRoute({
        description: 
            "Thumbnail Resources (defined in [Table 10.4.1-4](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-4)) are used to retrieve a rendered representation appropriate to stand for its parent DICOM Resource.",
        tags: ["WADO-RS"]
    }),
    zValidator("header", z.object({
        accept: z.enum([
            "image/jpeg",
            "*/*"
        ])
    })),
    zValidator("query", wadoRsQueryParamSchema.pick({
        viewport: true
    })),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
        studyInstanceUid: z.string().describe("The study instance UID"),
        seriesInstanceUid: z.string().describe("The series instance UID"),
        sopInstanceUid: z.string().describe("The sop instance UID")
    })),
    async (c) => {
        const {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid
        } = c.req.valid("param");

        const accept = c.req.valid("header").accept;

        return await retrieveInstanceThumbnailHandler(c, {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            accept
        });
    }
);

export default retrieveInstanceThumbnailRoute;