import type { DicomTag } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { verifyWorkspaceExists } from "@/server/middlewares/workspace.middleware";
import { searchStudySeriesInstancesQueryParamSchema } from "@/server/schemas/searchStudySeriesInstancesSchema";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";
import { eventLogger } from "@/server/utils/logger";

const searchInstancesRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/instances",
    describeRoute({
        description:
            "Search for DICOM instances (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
        tags: ["QIDO-RS"],
    }),
    verifyWorkspaceExists,
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("query", searchStudySeriesInstancesQueryParamSchema),
    async (c, next) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "SearchInstances",
            requestId: rqId,
            workspaceId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "SearchInstances",
            requestId: rqId,
            elapsedTime,
            workspaceId,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchInstanceQueryBuilder();

        try {
            const instances = await queryBuilder.execQuery({
                workspaceId,
                ...queryParams,
            });

            if (instances.length === 0) {
                return c.body(null, 204);
            }

            return c.json(
                instances.map(
                    (instance) => JSON.parse(instance.json) as DicomTag,
                ),
            );
        } catch (error) {
            eventLogger.error("Error searching for instances", {
                name: "SearchInstances",
                requestId: rqId,
                workspaceId,
                error: error instanceof Error ? error.message : String(error),
            });

            return c.json(
                {
                    error: "Internal server error",
                },
                500,
            );
        }
    },
);

export default searchInstancesRoute;
