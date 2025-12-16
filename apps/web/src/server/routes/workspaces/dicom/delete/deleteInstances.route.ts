import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";
import { deleteInstancesBodySchema } from "@/server/schemas/dicomDelete";
import { DicomDeleteService } from "@/server/services/dicom/dicomDelete.service";
import { InstanceService } from "@/server/services/instance.service";

const deleteInstancesRoute = new Hono().post(
    "/workspaces/:workspaceId/dicom/instances/delete",
    describeRoute({
        description: "Delete DICOM instances",
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
    zValidator("json", deleteInstancesBodySchema),
    async (c) => {
        const workspaceId = c.req.param("workspaceId");
        const { instanceIds } = c.req.valid("json");

        const distinctInstanceIds = [...new Set(instanceIds)];

        const instanceService = new InstanceService();
        const localInstanceIds =
            await instanceService.getInstancesBySopInstanceUid(
                workspaceId,
                distinctInstanceIds,
            );

        if (localInstanceIds.length === 0) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: {
                        message: "Instances not found",
                    },
                },
                404,
            );
        }

        const deleteService = new DicomDeleteService();
        const result = await deleteService.deleteInstances(
            workspaceId,
            localInstanceIds.map((instance) => instance.id),
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

export default deleteInstancesRoute;
