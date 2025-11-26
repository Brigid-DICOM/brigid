import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { DicomSeriesData } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { requireShareLinkTargetType, verifyStudyInShareLink } from "@/server/middlewares/shareLinkAccess.middleware";
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
    // 目前應該只有 study 層的分享 link 會用到這個 route
    // i.e. study 進入到 series 層取得 series 列表
    // series 層的分享，應使用 `/:token/series` route
    requireShareLinkTargetType("study"),
    verifyStudyInShareLink,
    async (c) => {
        try {
            const workspaceId = c.get("workspaceId");
            const { studyInstanceUid } = c.req.valid("param");
            const { offset, limit } = c.req.valid("query");

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
