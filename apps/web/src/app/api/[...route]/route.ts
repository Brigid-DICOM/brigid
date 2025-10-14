import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { AppDataSource } from "@brigid/database/src/dataSource";
import { AccountEntity } from "@brigid/database/src/entities/account.entity";
import { SessionEntity } from "@brigid/database/src/entities/session.entity";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import { VerificationTokenEntity } from "@brigid/database/src/entities/verificationToken.entity";
import { parseDataSourceConfig } from "@brigid/database/src/utils/parseDataSourceConfig";
import env from "@brigid/env";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { openAPIRouteHandler } from "hono-openapi";
import CasdoorProvider from "@/lib/auth/providers/casdoor";
import helloRoute from "@/server/routes/hello.route";
import workspacesRoute from "@/server/routes/workspaces/workspaces.route";
import { WorkspaceService } from "@/server/services/workspace.service";

function getAuthProvider() {
    if (env.AUTH_PROVIDER === "casdoor") {
        return CasdoorProvider({
            clientId: env.AUTH_CASDOOR_ID,
            clientSecret: env.AUTH_CASDOOR_SECRET,
            issuer: env.AUTH_CASDOOR_ISSUER
        });
    }
    throw new Error("Invalid auth provider");
}

export const app = new Hono().basePath("/api")
.use(async (c, next) => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    await next();
})
.use(
    "*",
    async (c, next) => {
        if (env.ENABLE_AUTH) {
            return initAuthConfig(() => ({
                basePath: "/api/auth",
                secret: env.NEXTAUTH_SECRET,
                providers: [getAuthProvider()],
                adapter: TypeORMAdapter({
                    ...parseDataSourceConfig(env.TYPEORM_CONNECTION),
                    entities: [
                        AccountEntity,
                        UserEntity,
                        SessionEntity,
                        VerificationTokenEntity
                    ],
                    synchronize: false
                }),
                callbacks: {
                    session: async ({ session }) => {
                        return session;
                    }
                },
                events: {
                    createUser: async ({ user }) => {
                        if (user.id) {
                            try {
                                const workspaceService = new WorkspaceService();
                                await workspaceService.createDefaultWorkspace({
                                    userId: user.id,
                                    userName: user.name ?? undefined
                                });
                            } catch (error) {
                                console.error("Error creating default configuration for user", error);
                            }
                        }
                    }
                }
            }))(c, next);
        }

        await next();
    }
)
.use("/auth/*", async (c, next) => {
    if (env.ENABLE_AUTH) {
        return authHandler()(c, next);
    }

    await next();
})
.route("/hello", helloRoute)
.route("/", workspacesRoute);

app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Brigid API",
                description: "Brigid API",
                version: "1.0.0"
            },
            servers: [
                {
                    url: env.NEXT_PUBLIC_APP_URL
                }
            ]
        },
        includeEmptyPaths: true
    })
)
.get(
    "/docs",
    swaggerUI({
        url: "/api/openapi.json"
    })
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type HonoAppRoute = typeof app;