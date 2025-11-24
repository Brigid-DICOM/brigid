import { Hono } from "hono";
import {
    describeRoute,
    validator as zValidator
} from "hono-openapi";
import { z } from "zod";
import { verifyAuthMiddleware } from "../middlewares/verifyAuth.middleware";
import { UserService } from "../services/user.service";
import { appLogger } from "../utils/logger";

const logger = appLogger.child({
    module: "UserRoute",
});

const searchUsersQueryParamSchema = z.object({
    query: z.string().min(1).describe("The query to search users"),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
});

const userRoute = new Hono().get(
    "/users/search",
    describeRoute({
        description: "Search users",
        tags: ["User"],
    }),
    verifyAuthMiddleware,
    zValidator("query", searchUsersQueryParamSchema),
    async (c) => {
        const authUser = c.get("authUser");
        const userId = authUser?.user?.id;
        const { query, limit, page } = c.req.valid("query");

        if (!userId) {
            return c.json({
                message: "Unauthorized"
            }, 401);
        }

        try {
            const userService = new UserService();
            const { users, pagination } = await userService.searchUsers({
                query,
                limit,
                page,
                excludeUserIds: [userId]
            });

            return c.json({
                ok: true,
                data: users,
                pagination: {
                    page: pagination.page,
                    limit: pagination.limit,
                    total: pagination.total,
                    hasNextPage: pagination.hasNextPage,
                }
            });
        } catch(error) {
            logger.error("Error searching users", error);
            return c.json({
                ok: false,
                data: null,
                error: "Error searching users"
            }, 500);
        }
    }
)

export default userRoute;