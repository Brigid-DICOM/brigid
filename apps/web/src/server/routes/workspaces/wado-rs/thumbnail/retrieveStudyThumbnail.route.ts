import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import { z } from "zod";
import { retrieveStudyThumbnailHandler } from "@/server/handlers/wado-rs/thumbnail/retrieveStudyThumbnail.handler";
import { wadoRsQueryParamSchema } from "@/server/schemas/wadoRs";

const retrieveStudyThumbnailRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/thumbnail",
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
    })),
    async (c) => {
        const {
            workspaceId,
            studyInstanceUid,
        } = c.req.valid("param");
        const { accept } = c.req.valid("header");

        return await retrieveStudyThumbnailHandler(c, {
            workspaceId,
            studyInstanceUid,
            accept,
        });
    }
);

export default retrieveStudyThumbnailRoute;