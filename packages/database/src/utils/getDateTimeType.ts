import env from "@brigid/env";
import { parseDataSourceConfig } from "./parseDataSourceConfig";

const dataSourceConfig = parseDataSourceConfig(env.TYPEORM_CONNECTION);

export function getDateTimeType() {
    if (dataSourceConfig.type === "better-sqlite3" || dataSourceConfig.type === "sqlite") {
        return "datetime";
    }

    return "timestamp";
}