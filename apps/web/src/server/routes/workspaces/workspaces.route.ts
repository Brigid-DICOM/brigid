import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import { WorkspaceService } from "@/server/services/workspace.service";
import searchInstancesRoute from "./qido-rs/searchInstances.route";
import searchSeriesRoute from "./qido-rs/searchSeries.route";
import searchStudiesRoute from "./qido-rs/searchStudies.route";
import searchStudySeriesRoute from "./qido-rs/searchStudySeries.route";
import searchStudySeriesInstancesRoute from "./qido-rs/searchStudySeriesInstances.route";
import stowRsRoute from "./stow-rs/stowRs.route";
import retrieveInstanceMetadataRoute from "./wado-rs/metadata/retrieveInstanceMetadata.route";
import retrieveSeriesMetadataRoute from "./wado-rs/metadata/retrieveSeriesMetadata.route";
import retrieveStudyMetadataRoute from "./wado-rs/metadata/retrieveStudyMetadata.route";
import retrieveFramePixelDataRoute from "./wado-rs/pixelData/retrieveFramePixelData.route";
import retrieveRenderedFramesRoute from "./wado-rs/rendered/retrieveRenderedFrames.route";
import retrieveRenderedInstancesRoute from "./wado-rs/rendered/retrieveRenderedInstances.route";
import retrieveInstanceRoute from "./wado-rs/retrieveInstance.route";
import retrieveSeriesInstancesRoute from "./wado-rs/retrieveSeriesInstances.route";
import retrieveStudyInstancesRoute from "./wado-rs/retrieveStudyInstances.route";
import retrieveInstanceThumbnailRoute from "./wado-rs/thumbnail/retrieveInstanceThumbnail.route";
import retrieveSeriesThumbnailRoute from "./wado-rs/thumbnail/retrieveSeriesThumbnail.route";
import retrieveStudyThumbnailRoute from "./wado-rs/thumbnail/retrieveStudyThumbnail.route";
import uriRetrieveInstanceRoute from "./wado-uri/uriRetrieveInstance.route";

const workspacesRoute = new Hono()
.route("/", stowRsRoute)
.route("/", retrieveStudyInstancesRoute)
.route("/", retrieveInstanceRoute)
.route("/", retrieveSeriesInstancesRoute)
.route("/", uriRetrieveInstanceRoute)
.route("/", searchStudiesRoute)
.route("/", searchStudySeriesRoute)
.route("/", searchStudySeriesInstancesRoute)
.route("/", searchSeriesRoute)
.route("/", searchInstancesRoute)
.route("/", retrieveFramePixelDataRoute)
.route("/", retrieveRenderedFramesRoute)
.route("/", retrieveRenderedInstancesRoute)
.route("/", retrieveInstanceMetadataRoute)
.route("/", retrieveSeriesMetadataRoute)
.route("/", retrieveStudyMetadataRoute)
.route("/", retrieveInstanceThumbnailRoute)
.route("/", retrieveSeriesThumbnailRoute)
.route("/", retrieveStudyThumbnailRoute)
.get(
    "/workspaces",
    describeRoute({
        description: "Get all workspaces",
        tags: ["Workspaces"]
    }),
    verifyAuthMiddleware,
    async (c) => {
        const workspaceService = new WorkspaceService();
        const authUser = c.get("authUser");

        if (!authUser?.user) {
            return c.json({
                message: "Unauthorized"
            }, 401);
        }

        if (!env.NEXT_PUBLIC_ENABLE_AUTH) {
            const workspaces = await workspaceService.getUserWorkspace(authUser.user.id);

            return c.json({
                workspaces
            });
        }

        const workspaces = await workspaceService.getUserWorkspace(authUser.user.id);
        return c.json({
            workspaces
        });
    }
);


export default workspacesRoute;