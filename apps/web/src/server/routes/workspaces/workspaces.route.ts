import { Hono } from "hono";
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
.route("/", uriRetrieveInstanceRoute);

export default workspacesRoute;