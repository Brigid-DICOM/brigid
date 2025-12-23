import env from "@brigid/env";
import { parseDataSourceConfig } from "./parseDataSourceConfig";

const dataSourceConfig = parseDataSourceConfig(env.TYPEORM_CONNECTION);

export function getDateTimeType() {
    if (process.env.NODE_ENV === "test" || dataSourceConfig.type === "better-sqlite3") {
        return "datetime";
    }

    return "timestamp";
}