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
import { searchStudySeriesInstancesQueryParamSchema } from "@/server/schemas/searchStudySeriesInstancesSchema";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";

const searchStudySeriesInstancesRoute = new Hono().get(
    "/workspaces/:workspaceId/studies/:studyInstanceUid/series/:seriesInstanceUid/instances",
    describeRoute({
        description:
            "Search for DICOM series instances (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
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
            seriesInstanceUid: z.string().describe("The series instance UID"),
        }),
    ),
    zValidator("query", searchStudySeriesInstancesQueryParamSchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");

        const queryBuilder = new DicomSearchInstanceQueryBuilder();
        const instances = await queryBuilder.execQuery({
            workspaceId,
            ...queryParams,
            StudyInstanceUID: c.req.param("studyInstanceUid"),
            SeriesInstanceUID: c.req.param("seriesInstanceUid"),
        });

        if (instances.length === 0) {
            return c.body(null, 204);
        }

        return c.json(
            instances.map((instance) => JSON.parse(instance.json) as DicomTag),
        );
    },
);

export default searchStudySeriesInstancesRoute;
