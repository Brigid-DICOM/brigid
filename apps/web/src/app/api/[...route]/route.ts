import GitHubProvider from "@auth/core/providers/github";
import GoogleProvider from "@auth/core/providers/google";
import { AppDataSource, initializeDb } from "@brigid/database/src/dataSource";
import { AccountEntity } from "@brigid/database/src/entities/account.entity";
import { SessionEntity } from "@brigid/database/src/entities/session.entity";
import { UserEntity } from "@brigid/database/src/entities/user.entity";
import { VerificationTokenEntity } from "@brigid/database/src/entities/verificationToken.entity";
import env from "@brigid/env";
import { authHandler, initAuthConfig } from "@hono/auth-js";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { openAPIRouteHandler } from "hono-openapi";
import CasdoorProvider from "@/lib/auth/providers/casdoor";
import { TypeORMAdapter } from "@/lib/auth/typeorm-adapter";
import guestRoute from "@/server/routes/guest.route";
import helloRoute from "@/server/routes/hello.route";
import shareRoute from "@/server/routes/share/share.route";
import userRoute from "@/server/routes/user.route";
import workspacesRoute from "@/server/routes/workspaces/workspaces.route";
import { WorkspaceService } from "@/server/services/workspace.service";

function getAuthProviders() {

    const providers = [];

    if (env.AUTH_CASDOOR_ID && env.AUTH_CASDOOR_SECRET && env.AUTH_CASDOOR_ISSUER) {
        providers.push(CasdoorProvider({
            clientId: env.AUTH_CASDOOR_ID,
            clientSecret: env.AUTH_CASDOOR_SECRET,
            issuer: env.AUTH_CASDOOR_ISSUER,
        }));
    }

    if (env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET) {
        providers.push(GitHubProvider({
            clientId: env.AUTH_GITHUB_ID,
            clientSecret: env.AUTH_GITHUB_SECRET,
        }));
    }

    if (env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET) {
        providers.push(GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID,
            clientSecret: env.AUTH_GOOGLE_SECRET,
        }));
    }

    return providers;
}

export const app = new Hono()
    .basePath("/api")
    .use(async (_, next) => {
        await initializeDb();

        await next();
    })
    .use("*", async (c, next) => {
        if (env.NEXT_PUBLIC_ENABLE_AUTH) {
            return initAuthConfig(() => ({
                basePath: "/api/auth",
                pages: {
                    signIn: "/auth/signin",
                },
                secret: env.NEXTAUTH_SECRET,
                providers: getAuthProviders(),
                adapter: TypeORMAdapter(AppDataSource.options, {
                    entities: {
                        ...AppDataSource.options.entities,
                        AccountEntity,
                        UserEntity,
                        SessionEntity,
                        VerificationTokenEntity,
                    },
                }),
                callbacks: {
                    session: async ({ session }) => {
                        return session;
                    },
                },
                events: {
                    createUser: async ({ user }) => {
                        if (user.id) {
                            try {
                                const workspaceService = new WorkspaceService();
                                await workspaceService.createDefaultWorkspace({
                                    userId: user.id,
                                    userName: user.name ?? undefined,
                                });
                            } catch (error) {
                                console.error(
                                    "Error creating default configuration for user",
                                    error,
                                );
                            }
                        }
                    },
                },
            }))(c, next);
        }

        await next();
    })
    .use("/auth/*", async (c, next) => {
        if (env.NEXT_PUBLIC_ENABLE_AUTH) {
            return authHandler()(c, next);
        }

        await next();
    })
    .route("/hello", helloRoute)
    .route("/", workspacesRoute)
    .route("/", userRoute)
    .route("/", shareRoute);

if (!env.NEXT_PUBLIC_ENABLE_AUTH) {
    app.route("/", guestRoute);
}

app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Brigid API",
                description: "Brigid API",
                version: "1.0.0",
            },
            servers: [
                {
                    url: env.NEXT_PUBLIC_APP_URL,
                },
            ],
        },
        includeEmptyPaths: true,
    }),
).get(
    "/docs",
    swaggerUI({
        url: "/api/openapi.json",
    }),
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type HonoAppRoute = typeof app;
