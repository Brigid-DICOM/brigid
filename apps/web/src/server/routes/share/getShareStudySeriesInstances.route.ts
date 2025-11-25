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
    module: "GetShareStudySeriesInstancesRoute",
});

const getShareStudySeriesInstancesRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/series/:seriesInstanceUid/instances",
    describeRoute({
        description: "Get instances for a shared study series",
        tags: ["Share Links - Public"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
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
            const { studyInstanceUid, seriesInstanceUid } =
                c.req.valid("param");
            const { offset, limit } = c.req.valid("query");

            const targetType = shareLink.targets[0]?.targetType;

            let isAllowed = false;
            if (targetType === "study") {
                isAllowed = shareLink.targets.some(
                    (t) =>
                        t.targetType === "study" &&
                        t.targetId === studyInstanceUid,
                );
            } else if (targetType === "series") {
                isAllowed = shareLink.targets.some(
                    (t) =>
                        t.targetType === "series" &&
                        t.targetId === seriesInstanceUid,
                );
            }

            if (!isAllowed) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Access denied: This study series is not shared by this share link",
                    },
                    403,
                );
            }

            const queryBuilder = new DicomSearchInstanceQueryBuilder();
            const instances = await queryBuilder.execQuery({
                workspaceId,
                StudyInstanceUID: studyInstanceUid,
                SeriesInstanceUID: seriesInstanceUid,
                offset,
                limit,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (instances.length === 0) {
                return c.json([], 200);
            }

            return c.json(
                instances.map(
                    (instance) => JSON.parse(instance.json) as DicomInstanceData,
                ),
                200,
            );
        } catch (error) {
            logger.error("Failed to get share study series instances", {
                error,
            });
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get share study series instances",
                },
                500,
            );
        }
    },
);

export default getShareStudySeriesInstancesRoute;
