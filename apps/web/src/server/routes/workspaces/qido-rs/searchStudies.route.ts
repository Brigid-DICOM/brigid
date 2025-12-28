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
import { searchStudiesQueryParamSchema } from "@/server/schemas/searchStudies";
import { DicomSearchStudyQueryBuilder } from "@/server/services/qido-rs/dicomSearchStudyQueryBuilder";
import { eventLogger } from "@/server/utils/logger";

const searchStudiesRoute = new Hono<{
    Variables: { rqId: string };
}>().get(
    "/workspaces/:workspaceId/studies",
    describeRoute({
        description:
            "Search for DICOM studies (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
        tags: ["QIDO-RS"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("query", searchStudiesQueryParamSchema),
    async (c, next) => {
        const rqId = c.get("rqId");
        const startTime = performance.now();

        eventLogger.info("request received", {
            name: "SearchStudies",
            requestId: rqId,
        });

        await next();

        const elapsedTime = performance.now() - startTime;
        eventLogger.info("request completed", {
            name: "SearchStudies",
            requestId: rqId,
            elapsedTime,
        });
    },
    async (c) => {
        const rqId = c.get("rqId");
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchStudyQueryBuilder();

        try {
            const studies = await queryBuilder.getStudiesWithRelatedCounts({
                workspaceId,
                ...queryParams,
            });
    
            if (studies.length === 0) {
                return c.body(null, 204);
            }
    
            return c.json(
                studies.map((study) => {
                    const studyData = JSON.parse(study.json) as DicomTag;
                    return {
                        ...studyData,
                        "00201206": {
                            vr: "IS",
                            Value: [study.numberOfStudyRelatedSeries || 0],
                        },
                        "00201208": {
                            vr: "IS",
                            Value: [study.numberOfStudyRelatedInstances || 0],
                        },
                    } as DicomTag;
                }),
            );
        } catch (error) {
            eventLogger.error("Error searching for studies", {
                name: "SearchStudies",
                requestId: rqId,
                error: error instanceof Error ? error.message : String(error),
            });

            return c.json({
                error: "Internal server error",
            }, 500);
        }
    },
);

export default searchStudiesRoute;
