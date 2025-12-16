import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { retrieveInstanceHandler } from "@/server/handlers/wado-rs/retrieveInstance.handler";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifyInstanceAccess } from "@/server/middlewares/shareLinkAccess.middleware";
import {
    wadoRsHeaderSchema,
    wadoRsQueryParamSchema,
} from "@/server/schemas/wadoRs";

const retrieveShareInstanceRoute = new Hono().get(
    "/:token/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid",
    describeRoute({
        description: "Retrieve DICOM instance (WADO-RS)",
        tags: ["Share Links - Public"],
    }),
    zValidator("header", wadoRsHeaderSchema),
    zValidator("query", wadoRsQueryParamSchema),
    zValidator(
        "param",
        z.object({
            studyInstanceUid: z.string().describe("The study instance UID"),
            seriesInstanceUid: z.string().describe("The series instance UID"),
            sopInstanceUid: z.string().describe("The sop instance UID"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifyInstanceAccess,
    async (c) => {
        const workspaceId = c.get("workspaceId");
        const { studyInstanceUid, seriesInstanceUid, sopInstanceUid } =
            c.req.valid("param");
        const { accept } = c.req.valid("header");

        return await retrieveInstanceHandler(c, {
            workspaceId,
            studyInstanceUid,
            seriesInstanceUid,
            sopInstanceUid,
            accept,
        });
    },
);

export default retrieveShareInstanceRoute;
