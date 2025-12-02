import type { DicomTag } from "@brigid/types";
import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import { z } from "zod";
import {
    verifyWorkspaceExists
} from "@/server/middlewares/workspace.middleware";
import {
    searchStudySeriesInstancesQueryParamSchema
} from "@/server/schemas/searchStudySeriesInstancesSchema";
import {
    DicomSearchInstanceQueryBuilder
} from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";

const searchInstancesRoute = new Hono().get(
    "/workspaces/:workspaceId/instances",
    describeRoute({
        description:
            "Search for DICOM instances (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
        tags: ["QIDO-RS"]
    }),
    verifyWorkspaceExists,
    zValidator("param", z.object({
        workspaceId: z.string().describe("The ID of the workspace"),
    })),
    zValidator("query", searchStudySeriesInstancesQueryParamSchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchInstanceQueryBuilder();
        const instances = await queryBuilder.execQuery({
            workspaceId,
            ...queryParams
        });

        if (instances.length === 0) {
            return c.body(null, 204);
        }

        return c.json(instances.map((instance) => JSON.parse(instance.json) as DicomTag));
    }
);

export default searchInstancesRoute;