import { Hono } from "hono";
import addAllowedIpRoute from "./addAllowedIp.route";
import addAllowedRemoteRoute from "./addAllowedRemote.route";
import createDimseConfigRoute from "./createDimseConfig.route";
import deleteDimseConfigRoute from "./deleteDimseConfig.route";
import getDimseConfigRoute from "./getDimseConfig.route";
import removeAllowedIpRoute from "./removeAllowedIp.route";
import removeAllowedRemoteRoute from "./removeAllowedRemote.route";
import updateAllowedRemoteRoute from "./updateAllowedRemote.route";
import updateDimseConfigRoute from "./updateDimseConfig.route";

const dimseRoute = new Hono()
    .route("/", getDimseConfigRoute)
    .route("/", createDimseConfigRoute)
    .route("/", updateDimseConfigRoute)
    .route("/", deleteDimseConfigRoute)
    .route("/", addAllowedIpRoute)
    .route("/", removeAllowedIpRoute)
    .route("/", addAllowedRemoteRoute)
    .route("/", updateAllowedRemoteRoute)
    .route("/", removeAllowedRemoteRoute);

export default dimseRoute;
