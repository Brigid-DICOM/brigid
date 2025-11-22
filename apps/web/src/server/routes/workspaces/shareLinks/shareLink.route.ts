import { Hono } from "hono";
import createShareLinkRoute from "./createShareLink.route";
import getShareLinksRoute from "./getShareLinks.route";
import updateShareLinkRoute from "./updateShareLink.route";
import verifyPasswordRoute from "./verifyPassword.route";

const shareLinkRoute = new Hono()
.route("/", createShareLinkRoute)
.route("/", getShareLinksRoute)
.route("/", updateShareLinkRoute)
.route("/", verifyPasswordRoute)

export default shareLinkRoute;