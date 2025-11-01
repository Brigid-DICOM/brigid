import env from "@brigid/env";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { UserService } from "@/server/services/user.service";

const guestRoute = new Hono()
.get(
    "/auth/session", // 這裡使用跟 auth js 一樣的路徑，
    describeRoute({
        description: "Get guest user nad workspace, only works when auth is disabled",
        tags: ["Guest"]
    }),
    async (c) => {
        if (env.NEXT_PUBLIC_ENABLE_AUTH) {
            return c.json({
                message: "Guest access is not allowed"
            }, 403);
        }

        try {
            const userService = new UserService();
            const guestUser = await userService.getGuestUser();

            return c.json({
                user: {
                    id: guestUser.id,
                    name: guestUser.name,
                    email: guestUser.email,
                    image: "/guest-avatar.png"
                }
            });
        } catch( error) {
            console.error("Error getting guest user and workspace", error);
            return c.json({
                message: "Error getting guest user and workspace"
            }, 500);
        }
    }
);

export default guestRoute;