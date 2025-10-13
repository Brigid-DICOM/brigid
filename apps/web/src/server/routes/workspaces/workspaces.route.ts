import { Hono } from "hono";
import stowRsRoute from "./stow-rs/stowRs.route";
import retrieveInstanceRoute from "./wado-rs/retrieveInstance.route";
import retrieveStudyInstancesRoute from "./wado-rs/retrieveStudyInstances.route";

const workspacesRoute = new Hono()
.route("/", stowRsRoute)
.route("/", retrieveStudyInstancesRoute)
.route("/", retrieveInstanceRoute);

export default workspacesRoute;