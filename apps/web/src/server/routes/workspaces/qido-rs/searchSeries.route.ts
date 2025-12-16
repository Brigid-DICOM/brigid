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

const searchSeriesRoute = new Hono().get(
    "/workspaces/:workspaceId/series",
    describeRoute({
        description:
            "Search for DICOM series (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
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
    zValidator("query", searchStudySeriesQueryParamSchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchSeriesQueryBuilder();

        const series = await queryBuilder.getSeriesWithRelatedCounts({
            workspaceId,
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
    },
);

export default searchSeriesRoute;
