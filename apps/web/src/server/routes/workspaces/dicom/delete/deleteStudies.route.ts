import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { deleteStudiesBodySchema } from "@/server/schemas/dicomDelete";
import { DicomDeleteService } from "@/server/services/dicom/dicomDelete.service";
import { StudyService } from "@/server/services/study.service";

const deleteStudiesRoute = new Hono().post(
    "/workspaces/:workspaceId/dicom/studies/delete",
    describeRoute({
        description: "Delete DICOM studies",
        tags: ["DICOM"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.DELETE),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    zValidator("json", deleteStudiesBodySchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const { studyIds } = c.req.valid("json");

        const distinctStudyIds = [...new Set(studyIds)];

        const studyService = new StudyService();
        const localStudyIds = await studyService.getStudiesByStudyInstanceUids(
            workspaceId,
            distinctStudyIds,
        );

        if (localStudyIds.length === 0) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: {
                        message: "Studies not found",
                    },
                },
                404,
            );
        }

        const deleteService = new DicomDeleteService();
        const result = await deleteService.deleteStudies(
            workspaceId,
            localStudyIds.map((study) => study.id),
        );

        return c.json(
            {
                ok: true,
                data: {
                    affected: result.affected,
                },
                error: null,
            },
            200,
        );
    },
);

export default deleteStudiesRoute;