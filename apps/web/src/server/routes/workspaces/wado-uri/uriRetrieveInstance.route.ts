import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import {
    z
} from "zod";
import { wadoUriQueryParamSchema } from "@/server/schemas/wadoUri";
import {
    InstanceService
} from "@/server/services/instance.service";
import { SingleInstanceHandler } from "../wado-rs/handlers/singleInstanceHandler";

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

        const instanceService = new InstanceService();
        const instance = await instanceService.getInstanceByUid({
            workspaceId,
            studyInstanceUid: studyUID,
            seriesInstanceUid: seriesUID,
            sopInstanceUid: objectUID
        });
        
        if (!instance) {
            return c.json(
                {
                    message: "Instance not found"
                },
                404
            );
        }

        const handler = new SingleInstanceHandler();

        if (!handler.canHandle(accept)) {
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

export default uriRetrieveInstanceRoute;