import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { InstanceService } from "@/server/services/instance.service";
import { wadoRsQueryParamSchema } from "@/server/types/dicom/wadoRs";
import { MultipartHandler } from "./handlers/multipartHandler";
import { ZipHandler } from "./handlers/zipHandler";

const retrieveInstanceRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid",
    describeRoute({
        description:
            "Retrieve DICOM instance (WADO-RS), ref: [Retrieve Transaction Instance Resources](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#table_10.4.1-1)",
        tags: ["WADO-RS"]
    }),
    zValidator(
        "header",
        z.object({
            accept: z
                .enum([
                    "application/zip",
                    'multipart/related; type="application/dicom"',
                    'multipart/related; type="application/octet-stream"',
                    'multipart/related; type="image/jpeg"',
                    'multipart/related; type="image/jp2"',
                    'multipart/related; type="image/png"',
                    "*/*"
                ])
                .default('multipart/related; type="application/dicom"')
        })
    ),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
            sopInstanceUid: z.string().describe("The sop instance UID")
        })
    ),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const seriesInstanceUid = c.req.param("seriesInstanceUid");
        const sopInstanceUid = c.req.param("sopInstanceUid");
        const { accept } = c.req.valid("header") as { accept: string };

        const instanceService = new InstanceService();
        const instance = await instanceService.getInstanceByUid({
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid
        });

        if (!instance) {
            return c.json(
                {
                    message: "Instance not found"
                },
                404
            );
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

        return handler.handle(c, { instances: [instance], accept: accept });
    }
);

export default retrieveInstanceRoute;
