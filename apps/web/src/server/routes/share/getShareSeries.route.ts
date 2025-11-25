import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { DicomSeriesData } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { DicomSearchSeriesQueryBuilder } from "@/server/services/qido-rs/dicomSearchSeriesQueryBuilder";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "GetShareSeriesRoute",
});

const getShareSeriesRoute = new Hono().get(
    `/:token/series`,
    describeRoute({
        description: "Get shared series by token",
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
            const { offset, limit } = c.req.valid("query");

            const targetType = shareLink.targets[0].targetType;
            if (targetType !== "series") {
                return c.json(
                    {
                        ok: false,
                        data: null,
                        error: `The share link targets ${targetType}, not series`,
                    },
                    400,
                );
            }

            const targetSeriesUids = shareLink.targets
                .filter((t) => t.targetType === "series")
                .map((t) => t.targetId);

            if (targetSeriesUids.length === 0) {
                return c.json([], 200);
            }

            const queryBuilder = new DicomSearchSeriesQueryBuilder();
            const series = await queryBuilder.getSeriesWithRelatedCounts({
                workspaceId,
                SeriesInstanceUID: targetSeriesUids.join(","),
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                offset,
                limit,
            });

            if (series.length === 0) {
                return c.json([], 200);
            }

            const result = series.map((series) => {
                const seriesData = JSON.parse(series.json) as DicomSeriesData;
                return {
                    ...seriesData,
                    "00201209": {
                        vr: "IS",
                        Value: [series.numberOfSeriesRelatedInstances || 0],
                    },
                };
            });

            return c.json(result, 200);
        } catch (error) {
            logger.error("Failed to get shared series", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get shared series",
                },
                500,
            );
        }
    },
);

export default getShareSeriesRoute;
