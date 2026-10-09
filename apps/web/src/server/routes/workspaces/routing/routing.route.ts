import { Hono } from "hono";
import destinationsRoute from "./destinations.route";
import jobsRoute from "./jobs.route";
import rulesRoute from "./rules.route";
import tagsRoute from "./tags.route";

const routingRoute = new Hono()
    .route("/", destinationsRoute)
    .route("/", rulesRoute)
    .route("/", tagsRoute)
    .route("/", jobsRoute);

export default routingRoute;
