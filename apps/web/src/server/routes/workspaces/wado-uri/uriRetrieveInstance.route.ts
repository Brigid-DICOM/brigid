import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { uriRetrieveInstanceHandler } from "@/server/handlers/wado-uri/uriRetrieveInstance.handler";
import { wadoUriQueryParamSchema } from "@/server/schemas/wadoUri";

const uriRetrieveInstanceRoute = new Hono()
.get(
    "/workspaces/:workspaceId/wado-uri",
    describeRoute({
        description: "Retrieve DICOM instance (WADO-URI), ref: [URI Service](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#chapter_9)",
        tags: ["WADO-URI"]
    }),
    zValidator("query", wadoUriQueryParamSchema),
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace")
    })),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const { 
            studyUID,
            seriesUID,
            objectUID
        } = c.req.valid("query");
        const accept = c.req.valid("query").contentType;

        return await uriRetrieveInstanceHandler(c, {
            workspaceId,
            studyInstanceUid: studyUID,
            seriesInstanceUid: seriesUID,
            sopInstanceUid: objectUID,
            accept,
        });
    }
);

export default uriRetrieveInstanceRoute;