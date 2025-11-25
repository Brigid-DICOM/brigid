import { Hono } from "hono";
import getShareLinksRoute from "../workspaces/shareLinks/getShareLinks.route";
import getShareInstancesRoute from "./getShareInstances.route";
import getShareSeriesRoute from "./getShareSeries.route";
import getShareStudiesRoute from "./getShareStudies.route";
import getShareStudySeriesRoute from "./getShareStudySeries.route";
import getShareStudySeriesInstancesRoute from "./getShareStudySeriesInstances.route";

const shareRoute = new Hono()
.basePath(
    "/share"
)
.route("/", getShareLinksRoute)
.route("/", getShareStudiesRoute)
.route("/", getShareStudySeriesRoute)
.route("/", getShareStudySeriesInstancesRoute)
.route("/", getShareSeriesRoute)
.route("/", getShareInstancesRoute);


export default shareRoute;