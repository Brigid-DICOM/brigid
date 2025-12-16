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

const recycleInstancesRoute = new Hono().post(
    "/workspaces/:workspaceId/dicom/instances/recycle",
    describeRoute({
        description: "Recycle DICOM instances",
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

        const instanceService = new InstanceService();
        const localInstanceIds =
            await instanceService.getInstancesBySopInstanceUid(
                workspaceId,
                instanceIds,
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
        const result = await deleteService.recycleInstances(
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

export default recycleInstancesRoute;
