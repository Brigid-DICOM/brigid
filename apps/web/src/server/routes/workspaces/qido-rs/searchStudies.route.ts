import type { DicomTag } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { verifyWorkspaceExists } from "@/server/middlewares/workspace.middleware";
import { searchStudiesQueryParamSchema } from "@/server/schemas/searchStudies";
import { DicomSearchStudyQueryBuilder } from "@/server/services/qido-rs/dicomSearchStudyQueryBuilder";

const searchStudiesRoute = new Hono().get(
    "/workspaces/:workspaceId/studies",
    describeRoute({
        description:
            "Search for DICOM studies (QIDO-RS), ref: [Search Transaction](https://dicom.nema.org/medical/dicom/current/output/html/part18.html#sect_10.6)",
        tags: ["QIDO-RS"],
    }),
    verifyWorkspaceExists,
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("query", searchStudiesQueryParamSchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const queryParams = c.req.valid("query");
        const queryBuilder = new DicomSearchStudyQueryBuilder();
        const studies = await queryBuilder.getStudiesWithRelatedCounts({
            workspaceId,
            ...queryParams,
        });

        if (studies.length === 0) {
            return c.body(null, 204);
        }

        return c.json(studies.map(
            (study) => {
                const studyData = JSON.parse(study.json) as DicomTag;
                return {
                    ...studyData,
                    "00201206": {
                        "vr": "IS",
                        "Value": [study.numberOfStudyRelatedSeries || 0]
                    },
                    "00201208": {
                        "vr": "IS",
                        "Value": [study.numberOfStudyRelatedInstances || 0]
                    }
                } as DicomTag;
            })
        );
    },
);

export default searchStudiesRoute;
