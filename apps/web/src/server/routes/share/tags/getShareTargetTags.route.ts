import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { TagService } from "@/server/services/tag.service";
import { verifyTargetAccess } from "./shareTagUtils";

const getShareTargetTagsRoute = new Hono().get(
    "/:token/tags/:targetType/:targetId",
    describeRoute({
        description: "Get tags for a target in shared context",
        tags: ["Share Links - Tags"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            targetType: z
                .enum(["study", "series", "instance"])
                .describe("The type of target"),
            targetId: z.string().describe("The ID of the target"),
        }),
    ),
    zValidator(
        "query",
        z.object({
            password: z
                .string()
                .optional()
                .describe("Password for protected share link"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    async (c) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const workspaceId = c.get("workspaceId");
        const { targetType, targetId } = c.req.valid("param");

        // 驗證 target 是否在 share link 允許的範圍內
        // Verify target is within share link's allowed scope
        const isTargetAllowed = await verifyTargetAccess(shareLink, targetType, targetId);
        if (!isTargetAllowed) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Access denied: This target is not shared by this share link",
                },
                403,
            );
        }

        const tagService = new TagService();
        const tags = await tagService.getTargetTags({
            workspaceId,
            targetType,
            targetId,
        });

        return c.json(
            {
                ok: true,
                data: tags,
                error: null,
            },
            200,
        );
    },
)

export default getShareTargetTagsRoute;