import { Hono } from "hono";
import createShareLinkRoute from "./createShareLink.route";
import deleteShareLinkRoute from "./deleteShareLink.route";
import getReceivedShareLinksRoute from "./getReceivedShareLinks.route";
import getShareLinksRoute from "./getShareLinks.route";
import getTargetShareLinkCountRoute from "./getTargetShareLinkCount.route";
import getTargetShareLinksRoute from "./getTargetShareLinks.route";
import publicShareLinkRoute from "./publicShareLink.route";
import updateShareLinkRoute from "./updateShareLink.route";
import verifyPasswordRoute from "./verifyPassword.route";

const shareLinkRoute = new Hono()
.route("/", createShareLinkRoute)
.route("/", getShareLinksRoute)
.route("/", updateShareLinkRoute)
.route("/", verifyPasswordRoute)
.route("/", deleteShareLinkRoute)
.route("/", publicShareLinkRoute)
.route("/", getTargetShareLinksRoute)
.route("/", getTargetShareLinkCountRoute)
.route("/", getReceivedShareLinksRoute)

export default shareLinkRoute;