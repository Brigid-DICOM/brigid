import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { DicomSeriesData } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { DicomSearchSeriesQueryBuilder } from "@/server/services/qido-rs/dicomSearchSeriesQueryBuilder";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "GetShareStudySeriesRoute",
});

const getShareStudySeriesRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/series",
    describeRoute({
        description: "Get series for a shared study",
        tags: ["Share Links - Public"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            studyInstanceUid: z.string().describe("The study instance UID"),
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
            const { studyInstanceUid } = c.req.valid("param");
            const { offset, limit } = c.req.valid("query");

            const targetType = shareLink.targets[0].targetType;
            if (targetType !== "study") {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: `The share link targets ${targetType}, not studies`,
                    },
                    400,
                );
            }

            const isStudyAllowed = shareLink.targets.some(
                (t) =>
                    t.targetType === "study" && t.targetId === studyInstanceUid,
            );

            if (!isStudyAllowed) {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: "Access denied: This study is not shared by this share link",
                    },
                    403,
                );
            }

            const queryBuilder = new DicomSearchSeriesQueryBuilder();
            const series = await queryBuilder.getSeriesWithRelatedCounts({
                workspaceId,
                StudyInstanceUID: studyInstanceUid,
                offset,
                limit,
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
            });

            if (series.length === 0) {
                return c.json([], 200);
            }

            const result = series.map((s) => {
                const seriesData = JSON.parse(s.json) as DicomSeriesData;
                return {
                    ...seriesData,
                    "00201209": {
                        vr: "IS",
                        Value: [s.numberOfSeriesRelatedInstances || 0],
                    },
                };
            });

            return c.json(result, 200);
        } catch (error) {
            logger.error("Failed to get shared study series", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get shared study series",
                },
                500,
            );
        }
    },
);

export default getShareStudySeriesRoute;
