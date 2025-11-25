import { DICOM_DELETE_STATUS } from "@brigid/database/src/const/dicom";
import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import type { DicomStudyData } from "@brigid/types";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { DicomSearchStudyQueryBuilder } from "@/server/services/qido-rs/dicomSearchStudyQueryBuilder";
import { appLogger } from "@/server/utils/logger";

const logger = appLogger.child({
    module: "GetShareStudiesRoute",
});

const getShareStudiesRoute = new Hono().get(
    `/:token/studies`,
    describeRoute({
        description: "Get shared studies by token",
        tags: ["Share Links - Public"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("Th share link token"),
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
            // 這裡的 shareLink 不會是 null，因為在 verifyShareLinkToken middleware 中已經檢查過了
            const shareLink = c.get("shareLink") as ShareLinkEntity;
            const workspaceId = c.get("workspaceId");
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

            const targetStudyUids = shareLink.targets
                .filter((t) => t.targetType === "study")
                .map((t) => t.targetId);

            if (targetStudyUids.length === 0) {
                return c.json([],200);
            }

            const queryBuilder = new DicomSearchStudyQueryBuilder();
            const studies = await queryBuilder.getStudiesWithRelatedCounts({
                workspaceId,
                StudyInstanceUID: targetStudyUids.join(","),
                deleteStatus: DICOM_DELETE_STATUS.ACTIVE,
                offset,
                limit,
            });

            if (studies.length === 0) {
                return c.json([], 200);
            }

            const result = studies.map((study) => {
                const studyData = JSON.parse(study.json) as DicomStudyData;
                return {
                    ...studyData,
                    "00201206": {
                        vr: "IS",
                        Value: [study.numberOfStudyRelatedSeries || 0],
                    },
                    "00201208": {
                        vr: "IS",
                        Value: [study.numberOfStudyRelatedInstances || 0],
                    },
                };
            });

            return c.json(result, 200);
        } catch (error) {
            logger.error("Failed to get shared studies", error);
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Failed to get shared studies",
                },
                500,
            );
        }
    },
);

export default getShareStudiesRoute;
