import { Hono } from "hono";

const helloRoute = new Hono().get("/", (c) =>
    c.json({ message: "Hello, world!" }),
);

export default helloRoute;
