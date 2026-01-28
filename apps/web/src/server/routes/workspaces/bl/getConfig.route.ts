import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute, validator as zValidator } from "hono-openapi";
import z from "zod";
import { WORKSPACE_PERMISSIONS } from "@/server/const/workspace.const";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import {
    verifyWorkspaceExists,
    verifyWorkspacePermission,
} from "@/server/middlewares/workspace.middleware";

const getBlueLightConfigRoute = new Hono().get(
    "/workspaces/:workspaceId/bl/config",
    describeRoute({
        description: "Get BlueLight config",
        tags: ["BlueLight"],
    }),
    verifyAuthMiddleware,
    verifyWorkspaceExists,
    verifyWorkspacePermission(WORKSPACE_PERMISSIONS.READ),
    zValidator(
        "param",
        z.object({
            workspaceId: z.string().describe("The ID of the workspace"),
        }),
    ),
    async (c) => {
        const { workspaceId } = c.req.valid("param");

        return c.json(getBlueLightConfig(workspaceId));
    },
);

function getBlueLightConfig(workspaceId: string) {
    const appUrl = new URL(env.NEXT_PUBLIC_APP_URL);
    const enableHttps = appUrl.protocol === "https:";
    return {
        DICOMWebServersConfig: [
            {
                AETitle: "YMOrthanc",
                "QIDO-enableHTTPS": enableHttps,
                "WADO-enableHTTPS": enableHttps,
                "QIDO-hostname": appUrl.hostname,
                "WADO-hostname": appUrl.hostname,
                "QIDO-PORT": appUrl.port,
                "WADO-PORT": appUrl.port,
                contentType: "application/json",
                timeout: 80000,
                limit: env.QUERY_MAX_LIMIT,
                charset: "UTF=8",
                QIDO: `api/workspaces/${workspaceId}`,
                "WADO-URI": `api/workspaces/${workspaceId}/wado-uri`,
                "WADO-RS": `api/workspaces/${workspaceId}`,
                "WADO-RS/URI": "RS",
                STOW: `api/workspaces/${workspaceId}`,
                enableRetrieveURI: false,
                includefield: false,
                enableXml2Dcm: false,
                Xml2DcmUrl: "/upload",
                target: "https://cylab-tw.github.io/bluelight/bluelight/html/start.html",
                token: {
                    apikey: "",
                    bearer: "",
                },
            },
        ],
        "thumnail_witdth": 70,
        "TitleTag": "BlueLight Viewer",
        "study_comparison": false,
        "AdvanceMode": true
    };
}

export default getBlueLightConfigRoute;
