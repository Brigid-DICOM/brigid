import { Hono } from "hono";
import searchInstancesRoute from "./qido-rs/searchInstances.route";
import searchSeriesRoute from "./qido-rs/searchSeries.route";
import searchStudiesRoute from "./qido-rs/searchStudies.route";
import searchStudySeriesRoute from "./qido-rs/searchStudySeries.route";
import searchStudySeriesInstancesRoute from "./qido-rs/searchStudySeriesInstances.route";
import stowRsRoute from "./stow-rs/stowRs.route";
import retrieveFramePixelDataRoute from "./wado-rs/pixelData/retrieveFramePixelData.route";
import retrieveRenderedFramesRoute from "./wado-rs/rendered/retrieveRenderedFrames.route";
import retrieveRenderedInstancesRoute from "./wado-rs/rendered/retrieveRenderedInstances.route";
import retrieveInstanceRoute from "./wado-rs/retrieveInstance.route";
import retrieveSeriesInstancesRoute from "./wado-rs/retrieveSeriesInstances.route";
import retrieveStudyInstancesRoute from "./wado-rs/retrieveStudyInstances.route";
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
.route("/", retrieveRenderedInstancesRoute);


export default workspacesRoute;