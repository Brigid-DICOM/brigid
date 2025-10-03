import { Hono } from "hono";
import stowRsRoute from "./stow-rs/stowRs.route";

const workspacesRoute = new Hono()
.route("/", stowRsRoute);

export default workspacesRoute;