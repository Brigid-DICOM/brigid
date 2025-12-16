import { Hono } from "hono";
import getShareLinksRoute from "../workspaces/shareLinks/getShareLinks.route";
import getShareInstancesRoute from "./getShareInstances.route";
import getShareSeriesRoute from "./getShareSeries.route";
import getShareStudiesRoute from "./getShareStudies.route";
import getShareStudySeriesRoute from "./getShareStudySeries.route";
import getShareStudySeriesInstancesRoute from "./getShareStudySeriesInstances.route";
import retrieveShareInstanceThumbnailRoute from "./retrieveShareInstanceThumbnail.route";
import retrieveShareSeriesThumbnailRoute from "./retrieveShareSeriesThumbnail.route";
import retrieveShareStudyThumbnailRoute from "./retrieveShareStudyThumbnail.route";
import shareTagRoutes from "./tags/shareTag.route";
import retrieveShareInstanceRoute from "./wado-rs/retrieveShareInstance.route";
import retrieveShareSeriesInstancesRoute from "./wado-rs/retrieveShareSeriesInstances.route";
import retrieveShareStudyInstancesRoute from "./wado-rs/retrieveShareStudyInstances.route";
import uriRetrieveShareInstanceRoute from "./wado-uri/uriRetrieveShareInstance.route";

const shareRoute = new Hono()
    .basePath("/share")
    .route("/", getShareLinksRoute)
    .route("/", getShareStudiesRoute)
    .route("/", getShareStudySeriesRoute)
    .route("/", getShareStudySeriesInstancesRoute)
    .route("/", getShareSeriesRoute)
    .route("/", getShareInstancesRoute)
    .route("/", retrieveShareStudyThumbnailRoute)
    .route("/", retrieveShareSeriesThumbnailRoute)
    .route("/", retrieveShareInstanceThumbnailRoute)
    .route("/", retrieveShareStudyInstancesRoute)
    .route("/", retrieveShareSeriesInstancesRoute)
    .route("/", retrieveShareInstanceRoute)
    .route("/", uriRetrieveShareInstanceRoute)
    .route("/", shareTagRoutes);

export default shareRoute;
