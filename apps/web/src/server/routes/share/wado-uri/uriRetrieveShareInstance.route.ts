import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import { z } from "zod";
import { uriRetrieveInstanceHandler } from "@/server/handlers/wado-uri/uriRetrieveInstance.handler";
import { setUserMiddleware } from "@/server/middlewares/setUser.middleware";
import { verifyShareLinkToken } from "@/server/middlewares/shareLink.middleware";
import { verifyInstanceAccess } from "@/server/middlewares/shareLinkAccess.middleware";
import { wadoUriQueryParamSchema } from "@/server/schemas/wadoUri";

const uriRetrieveShareInstanceRoute = new Hono().get(
    "/:token/wado-uri",
    describeRoute({
        description: "Retrieve DICOM instance (WADO-URI) for shared content",
        tags: ["Share Links - Public"],
    }),
    zValidator("query", wadoUriQueryParamSchema),
    zValidator(
        "param",
        z.object({
            token: z.string().describe("The token of the share link"),
        }),
    ),
    setUserMiddleware,
    verifyShareLinkToken,
    verifyInstanceAccess,
    async (c) => {
        const { studyUID, seriesUID, objectUID } = c.req.valid("query");
        const accept = c.req.valid("query").contentType;

        return await uriRetrieveInstanceHandler(c, {
            workspaceId: c.get("workspaceId"),
            studyInstanceUid: studyUID,
            seriesInstanceUid: seriesUID,
            sopInstanceUid: objectUID,
            accept,
        });
    },
);

export default uriRetrieveShareInstanceRoute;
