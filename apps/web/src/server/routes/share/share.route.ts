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

const shareRoute = new Hono()
.basePath(
    "/share"
)
.route("/", getShareLinksRoute)
.route("/", getShareStudiesRoute)
.route("/", getShareStudySeriesRoute)
.route("/", getShareStudySeriesInstancesRoute)
.route("/", getShareSeriesRoute)
.route("/", getShareInstancesRoute)
.route("/", retrieveShareStudyThumbnailRoute)
.route("/", retrieveShareSeriesThumbnailRoute)
.route("/", retrieveShareInstanceThumbnailRoute);


export default shareRoute;