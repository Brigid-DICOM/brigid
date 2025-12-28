import type { DicomTag } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { searchStudySeriesQueryParamSchema } from "@/server/schemas/searchStudySeriesSchema";
import { DicomSearchSeriesQueryBuilder } from "@/server/services/qido-rs/dicomSearchSeriesQueryBuilder";
import { eventLogger } from "@/server/utils/logger";

const searchStudySeriesRoute = new Hono<{
    Variables: { rqId: string }
}>().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series",
    describeRoute({
        description:
            "Search for DICOM study's series (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
        tags: ["QIDO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
            studyInstanceUid: z.string().describe("The study instance UID"),
        }),
    ),
    zValidator("query", searchStudySeriesQueryParamSchema),
    async (c, next) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "SearchStudySeries",
            requestId: rqId,
            workspaceId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "SearchStudySeries",
            requestId: rqId,
            elapsedTime,
            workspaceId,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchSeriesQueryBuilder();

        try {
            const series = await queryBuilder.getSeriesWithRelatedCounts({
                workspaceId,
                StudyInstanceUID: c.req.param("studyInstanceUid"),
                ...queryParams,
            });
    
            if (series.length === 0) {
                return c.body(null, 204);
            }
    
            return c.json(
                series.map((series) => {
                    const seriesData = JSON.parse(series.json) as DicomTag;
                    return {
                        ...seriesData,
                        "00201209": {
                            vr: "IS",
                            Value: [series.numberOfSeriesRelatedInstances || 0],
                        },
                    } as DicomTag;
                }),
            );

        } catch (error) {
            eventLogger.error("Error searching for study series", {
                name: "SearchStudySeries",
                requestId: rqId,
                workspaceId,
                error: error instanceof Error ? error.message : String(error),
            });

            return c.json({
                error: "Internal server error",
            }, 500);
        }
    },
);

export default searchStudySeriesRoute;
