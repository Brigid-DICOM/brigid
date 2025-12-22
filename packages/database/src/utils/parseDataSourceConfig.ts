import path from "node:path";
import type { DataSourceOptions } from "typeorm";
import { PGliteDriver } from "typeorm-pglite";

function getWritableRoot() {
    const cwd = process.cwd();

    if (cwd.startsWith("/snapshot")) {
        return path.dirname(process.execPath);
    }
    return cwd;
}

let pgliteDriver: PGliteDriver;

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

    try {
        const parsedUrl = new URL(configOrString);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const config: any = {};

        if (parsedUrl.protocol.startsWith("mongodb+srv")) {
            config.type = "mongodb";
            config.url = configOrString.replace(/\?(.*)$/, "");
            config.useNewUrlParser = true;
        } else if (parsedUrl.protocol.startsWith("pglite")) {
            config.type = "postgres";
            if (!pgliteDriver) {
                pgliteDriver = new PGliteDriver({
                    dataDir: path
                        .resolve(getWritableRoot(), "bridge-local-db")
                        .replace(/\\/g, "/")
                });
            }
            config.driver = pgliteDriver.driver;
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
