import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import { createMiddleware } from "hono/factory";

type ShareLinkTargetType = "study" | "series" | "instance";

interface ShareLinkEnv {
    Variables: {
        shareLink: ShareLinkEntity;
        workspaceId: string;
    };
}

/**
 * Verify that the share link target type matches the expected type
 */
export const requireShareLinkTargetType = (
    expectedType: ShareLinkTargetType,
) => {
    return createMiddleware<ShareLinkEnv>(async (c, next) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const targetType = shareLink.targets[0]?.targetType;

        if (targetType !== expectedType) {
            const typeLabel =
                expectedType === "study"
                    ? "studies"
                    : expectedType === "series"
                      ? "series"
                      : "instances";

            return c.json(
                {
                    ok: false,
                    data: null,
                    error: `The share link targets ${targetType}, not ${typeLabel}`,
                },
                400,
            );
        }

        await next();
    });
};

/**
 * 驗證 studyInstanceUid 是否在 share link 的 targets 中
 * Verify that studyInstanceUid is in the share link targets
 */
export const verifyStudyInShareLink = createMiddleware<ShareLinkEnv>(
    async (c, next) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const studyInstanceUid = c.req.param("studyInstanceUid");

        if (!studyInstanceUid) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Study instance UID is required",
                },
                400,
            );
        }

        const isStudyAllowed = shareLink.targets.some(
            (t) => t.targetType === "study" && t.targetId === studyInstanceUid,
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

        await next();
    },
);

/**
 * 驗證 series instances 的存取權限（根據 share link 類型決定驗證方式）
 * Verify series instances access based on share link target type
 */
export const verifySeriesInstancesAccess = createMiddleware<ShareLinkEnv>(
    async (c, next) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const studyInstanceUid = c.req.param("studyInstanceUid");
        const seriesInstanceUid = c.req.param("seriesInstanceUid");

        const targetType = shareLink.targets[0]?.targetType;

        let isAllowed = false;

        if (targetType === "study") {
            isAllowed = shareLink.targets.some(
                (t) =>
                    t.targetType === "study" && t.targetId === studyInstanceUid,
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

        await next();
    },
);

export const verifyInstanceAccess = createMiddleware<ShareLinkEnv>(
    async (c, next) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const studyInstanceUid =
            c.req.param("studyInstanceUid") || c.req.query("studyUID");
        const seriesInstanceUid =
            c.req.param("seriesInstanceUid") || c.req.query("seriesUID");
        const sopInstanceUid =
            c.req.param("sopInstanceUid") || c.req.query("objectUID");

        const targetType = shareLink.targets[0]?.targetType;
        let isAllowed = false;

        if (targetType === "study") {
            isAllowed = shareLink.targets.some(
                (t) =>
                    t.targetType === "study" && t.targetId === studyInstanceUid,
            );
        } else if (targetType === "series") {
            isAllowed = shareLink.targets.some(
                (t) =>
                    t.targetType === "series" &&
                    t.targetId === seriesInstanceUid,
            );
        } else if (targetType === "instance") {
            isAllowed = shareLink.targets.some(
                (t) =>
                    t.targetType === "instance" &&
                    t.targetId === sopInstanceUid,
            );
        }

        if (!isAllowed) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Access denied: This study's series instance is not shared by this share link",
                },
                403,
            );
        }

        await next();
    },
);
