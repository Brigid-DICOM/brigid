import { Hono } from "hono";
import stowRsRoute from "./stow-rs/stowRs.route";
import retrieveInstanceRoute from "./wado-rs/retrieveInstance.route";

const workspacesRoute = new Hono()
.route("/", stowRsRoute)
.route("/", retrieveInstanceRoute);

export default workspacesRoute;