import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { dateRangeSchema } from "@/server/schemas/dateRangeSchema";
import { InstanceService } from "@/server/services/instance.service";
import { PatientService } from "@/server/services/patient.service";
import { SeriesService } from "@/server/services/series.service";

const getStatsRoute = new Hono().get(
    "/workspaces/:workspaceId/dicom/stats",
    describeRoute({
        description: "Get DICOM stats",
        tags: ["DICOM"],
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
    zValidator(
        "query",
        z.object({
            range: dateRangeSchema.optional(),
        }),
    ),
    async (c) => {
        const { workspaceId } = c.req.valid("param");
        const { range } = c.req.valid("query");

        const authUser = c.get("authUser");
        if (!authUser?.user) {
            return c.json(
                {
                    message: "Unauthorized",
                },
                401,
            );
        }

        const stats = await getDicomStats(workspaceId, range);
        return c.json(stats);
    },
);

async function getDicomStats(workspaceId: string, range?: string) {
    const patientService = new PatientService();
    const patientCount = await patientService.getPatientCount(
        workspaceId,
        range,
        DICOM_DELETE_STATUS.ACTIVE,
    );
    const instanceService = new InstanceService();
    const instanceCount = await instanceService.getInstanceCount(
        workspaceId,
        range,
        DICOM_DELETE_STATUS.ACTIVE,
    );
    const seriesService = new SeriesService();
    const modalityCount = await seriesService.getUniqueModalities(
        workspaceId,
        range,
        DICOM_DELETE_STATUS.ACTIVE,
    );

    return {
        patientCount,
        instanceCount,
        modalities: modalityCount,
    };
}

export default getStatsRoute;
