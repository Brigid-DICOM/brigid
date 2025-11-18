import { Hono } from "hono";
import assignTagRoute from "./assignTag.route";
import createTagRoute from "./createTag.route";
import deleteTagRoute from "./deleteTag.route";
import getAllTagsRoute from "./getAllTags.route";
import getTargetTagsRoute from "./getTargetTags.route";
import removeAssignmentRoute from "./removeAssignment.route";
import updateTagRoute from "./updateTag.route";

const tagRoute = new Hono()
.route("/", createTagRoute)
.route("/", updateTagRoute)
.route("/", deleteTagRoute)
.route("/", getAllTagsRoute)
.route("/", getTargetTagsRoute)
.route("/", assignTagRoute)
.route("/", removeAssignmentRoute)


export default tagRoute;