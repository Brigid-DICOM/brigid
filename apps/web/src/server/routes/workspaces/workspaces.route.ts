import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { verifyAuthMiddleware } from "@/server/middlewares/verifyAuth.middleware";
import { WorkspaceService } from "@/server/services/workspace.service";
import getBlueLightConfigRoute from "./bl/getConfig.route";
import deleteInstancesRoute from "./dicom/delete/deleteInstances.route";
import deleteSeriesRoute from "./dicom/delete/deleteSeries.route";
import deleteStudiesRoute from "./dicom/delete/deleteStudies.route";
import recycleInstancesRoute from "./dicom/delete/recycleInstances.route";
import recycleSeriesRoute from "./dicom/delete/recycleSeries.route";
import recycleStudyRoute from "./dicom/delete/recycleStudy.route";
import restoreInstancesRoute from "./dicom/delete/restoreInstances.route";
import restoreSeriesRoute from "./dicom/delete/restoreSeries.route";
import restoreStudyRoute from "./dicom/delete/restoreStudy.route";
import getStatsRoute from "./dicom/getStats.route";
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
.route("/", getStatsRoute)
.route("/", recycleInstancesRoute)
.route("/", recycleSeriesRoute)
.route("/", recycleStudyRoute)
.route("/", restoreInstancesRoute)
.route("/", restoreSeriesRoute)
.route("/", restoreStudyRoute)
.route("/", deleteInstancesRoute)
.route("/", deleteSeriesRoute)
.route("/", deleteStudiesRoute)
.route("/", getBlueLightConfigRoute)
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
)
.get(
    "/workspaces/default",
    describeRoute({
        description: "Get default workspace",
        tags: ["Workspaces"]
    }),
    verifyAuthMiddleware,
    async (c) => {
        const authUser = c.get("authUser");
        const userId = authUser?.user?.id;
        if (!userId) {
            return c.json({
                message: "Unauthorized"
            }, 401);
        }

        const workspaceService = new WorkspaceService();

        const defaultWorkspace = await workspaceService.getDefaultWorkspace(userId);
        if (!defaultWorkspace) {
            return c.json({
                message: "Default workspace not found"
            }, 404);
        }

        return c.json({
            workspace: {
                id: defaultWorkspace.id,
                name: defaultWorkspace.name,
                ownerId: defaultWorkspace.ownerId,
                createdAt: defaultWorkspace.createdAt,
                updatedAt: defaultWorkspace.updatedAt
            }
        });
    }
);

export default workspacesRoute;