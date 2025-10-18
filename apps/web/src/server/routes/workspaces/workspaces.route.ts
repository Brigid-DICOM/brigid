import { Hono } from "hono";
import searchStudiesRoute from "./qido-rs/searchStudies.route";
import stowRsRoute from "./stow-rs/stowRs.route";
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
.route("/", searchStudiesRoute);

export default workspacesRoute;