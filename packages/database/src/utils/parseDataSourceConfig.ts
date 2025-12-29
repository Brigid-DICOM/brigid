import type { DataSourceOptions } from "typeorm";

/**
 * from {@link https://github.com/nextauthjs/next-auth/blob/main/packages/adapter-typeorm/src/utils.ts | authjs/typeorm-adapter}
 * Ensure configOrString is normalized to an object.
 * @param configOrString
 * @returns
 */
export function parseDataSourceConfig(
    configOrString: DataSourceOptions | string
): DataSourceOptions {
    if (typeof configOrString !== "string") {
        return {
            ...configOrString
        };
    }

    if (configOrString === "sqlite://:memory:") {
        return {
            type: "sqlite",
            database: ":memory:",
        }
    }

    try {
        const parsedUrl = new URL(configOrString);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config: any = {};

        if (parsedUrl.protocol.startsWith("mongodb+srv")) {
            config.type = "mongodb";
            config.url = configOrString.replace(/\?(.*)$/, "");
            config.useNewUrlParser = true;
        } else {
            config.type = parsedUrl.protocol.replace(/:$/, "");
            config.host = parsedUrl.hostname;
            config.port = parseInt(parsedUrl.port, 10);
            config.username = parsedUrl.username;
            config.password = parsedUrl.password;
            config.database = parsedUrl.pathname
                .replace(/^\//, "")
                .replace(/\?(.*)$/, "");
            config.options = {};
        }

        if (config.type === "mongodb") {
            config.useUnifiedTopology = true;
        }

        // Prevents warning about deprecated option (sets default value)
        if (config.type === "mssql") {
            config.options.enableArithAbort = true;
        }

        if (config.type === "sqlite" || config.type === "better-sqlite3") {
            config.poolSize = 1;
        }

        if (parsedUrl.search) {
            parsedUrl.search
                .replace(/^\?/, "")
                .split("&")
                .forEach((keyValuePair) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
                    let [key, value] = keyValuePair.split("=") as any;
                    // Converts true/false strings to actual boolean values
                    if (value === "true") {
                        value = true;
                    }
                    if (value === "false") {
                        value = false;
                    }
                    config[key] = value;
                });
        }

        return config;
    } catch (err) {
        // If URL parsing fails for any reason, try letting TypeORM handle it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.log(err);
        return { url: configOrString } as any;
    }
}
