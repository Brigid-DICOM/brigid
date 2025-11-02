import env from "@brigid/env";
import { verifyAuth } from "@hono/auth-js";
import { createMiddleware } from "hono/factory";
import { UserService } from "../services/user.service";

export const verifyAuthMiddleware = createMiddleware(async (c, next) => {
    if (env.NEXT_PUBLIC_ENABLE_AUTH) {
        return verifyAuth()(c, next);
    }

    const userService = new UserService();
    const guestUser = await userService.getGuestUser();
    if (!guestUser) {
        return c.json({
            message: "Guest user not found"
        }, 404);
    }
    c.set("authUser", {
        session: {
            user: {
                id: guestUser.id,
                name: guestUser.name ?? "",
                email: guestUser.email ?? "",
            },
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
        },
        user: {
            id: guestUser.id,
            email: guestUser.email ?? "",
            emailVerified: guestUser.emailVerified ? new Date(guestUser.emailVerified) : null
        }
    });

    await next();
});