import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { DicomInstanceData } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { DicomSearchInstanceQueryBuilder } from "@/server/services/qido-rs/dicomSearchInstanceQueryBuilder";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "GetShareInstancesRoute",
});

const getShareInstancesRoute = new Hono().get(
    "/:token/instances",
    describeRoute({
        description: "Get shared instances by token",
        tags: ["Share Links - Public"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
        }),
    ),
    zValidator(
        "query",
        z.object({
            password: z
                .string()
                .optional()
                .describe("Password for protected share link"),
            offset: z.coerce.number().default(0).describe("Pagination offset"),
            limit: z.coerce.number().default(10).describe("Pagination limit"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    async (c) => {
        try {
            const shareLink = c.get("shareLink") as ShareLinkEntity;
            const workspaceId = c.get("workspaceId");

            const targetType = shareLink.targets[0]?.targetType;

            if (targetType !== "instance") {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Access denied: This share link does not share instances",
                    },
                    403,
                );
            }

            const { offset, limit } = c.req.valid("query");

            const targetInstanceUids = shareLink.targets
                .filter((t) => t.targetType === "instance")
                .map((t) => t.targetId);

            const queryBuilder = new DicomSearchInstanceQueryBuilder();
            const instances = await queryBuilder.execQuery({
                workspaceId,
                SOPInstanceUID: targetInstanceUids.join(","),
                offset,
                limit,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (instances.length === 0) {
                return c.json([], 200);
            }

            return c.json(
                instances.map(
                    (instance) =>
                        JSON.parse(instance.json) as DicomInstanceData,
                ),
                200,
            );
        } catch (error) {
            logger.error("Failed to get shared instances", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get shared instances",
                },
                500,
            );
        }
    },
);

export default getShareInstancesRoute;
