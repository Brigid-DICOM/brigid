import type { ShareLinkEntity } from "@brigid/database/src/entities/shareLink.entity";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { SHARE_PERMISSIONS } from "@/server/const/share.const";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifyShareLinkPermission } from "@/server/middlewares/shareLinkPermission.middleware";
import { shareAssignTagSchema } from "@/server/schemas/tagSchema";
import { TagService } from "@/server/services/tag.service";
import { batchVerifyTargetAccess } from "./shareTagUtils";

const assignShareTagRoute = new Hono().post(
    "/:token/tags/assign",
    describeRoute({
        description: "Assign a tag to a shared target",
        tags: ["Share Links - Tags"],
    }),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
        }),
    ),
    setUserMiddleware,
    zValidator("json", shareAssignTagSchema),
    verifyShareLinkToken,
    verifyShareLinkPermission(SHARE_PERMISSIONS.UPDATE),
    async (c) => {
        const shareLink = c.get("shareLink") as ShareLinkEntity;
        const workspaceId = c.get("workspaceId");
        const { tags, targets } = c.req.valid("json");

        const { allowed: allowedTargets, denied: deniedTargets } =
            await batchVerifyTargetAccess(shareLink, targets);

        if (allowedTargets.length === 0) {
            return c.json(
                {
                    ok: false,
                    data: null,
                    error: "Access denied: None of the targets are shared by this share link",
                },
                403,
            );
        }

        const tagService = new TagService();
        const results = await tagService.upsertAndAssignTags({
            workspaceId,
            tags,
            targets: allowedTargets,
        });

        return c.json(
            {
                ok: true,
                data: {
                    results: results.map((r) => ({
                        tag: {
                            id: r.tag.id,
                            name: r.tag.name,
                            color: r.tag.color,
                        },
                        created: r.created,
                        assignmentCount: r.assignments.length,
                    })),
                    deniedTargets:
                        deniedTargets.length > 0
                            ? deniedTargets.map((t) => ({
                                  targetType: t.targetType,
                                  targetId: t.targetId,
                              }))
                            : null,
                },
                error: null,
            },
            201,
        );
    },
);

export default assignShareTagRoute;
