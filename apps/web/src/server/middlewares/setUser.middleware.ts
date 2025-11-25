import env from "@brigid/env";
import { getAuthUser } from "@hono/auth-js";
import { createMiddleware } from "hono/factory";


// 設置 user 的 middleware
// 正常來說，目前只套用到分享 (share) 相關的 routes，因為這些 routes 需要取得 user 的資訊以確認是否具有對應權限
export const setUserMiddleware = createMiddleware(async (c, next) => {
    if (env.NEXT_PUBLIC_ENABLE_AUTH) {
        const authUser = await getAuthUser(c);
        const isAuth = !!authUser?.token || !!authUser?.user;

        if (isAuth) {
            c.set("authUser", authUser);
        }
    }

    await next();
});