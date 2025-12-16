import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { retrieveSeriesInstancesHandler } from "@/server/handlers/wado-rs/retrieveSeriesInstances.handler";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifySeriesInstancesAccess } from "@/server/middlewares/shareLinkAccess.middleware";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";

const retrieveShareSeriesInstancesRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/series/:seriesInstanceUid",
    describeRoute({
        description:
            "Retrieve DICOM series instances (WADO-RS) for shared content",
        tags: ["Share Links - Public"],
    }),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The share link token"),
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifySeriesInstancesAccess,
    async (c) => {
        const workspaceId = c.get("workspaceId");
        const { studyInstanceUid, seriesInstanceUid } = c.req.valid("param");
        const { accept } = c.req.valid("header");

        return await retrieveSeriesInstancesHandler(c, {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            accept,
        });
    },
);

export default retrieveShareSeriesInstancesRoute;
