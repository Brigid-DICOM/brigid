import { Hono } from "hono";
import assignShareTagRoute from "./assignShareTag.route";
import getShareTargetTagsRoute from "./getShareTargetTags.route";
import removeShareAssignmentRoute from "./removeShareAssignment.route";

const shareTagRoute = new Hono()
    .route("/", getShareTargetTagsRoute)
    .route("/", assignShareTagRoute)
    .route("/", removeShareAssignmentRoute);

export default shareTagRoute;
