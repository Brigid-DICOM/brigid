import * as SqliteDriver from "sqlite3";
import { DataSource, type DataSourceOptions } from "typeorm";
import { buildMigratedDataSourceOptions } from "./dataSourceOptions";
import { parseDataSourceConfig } from "./utils/parseDataSourceConfig";

export function createMigratedDataSource(
    configOrString: DataSourceOptions | string = process.env.TEST_DB_URL || "sqlite://:memory:",
): DataSource {
    const dataSourceConfig = parseDataSourceConfig(configOrString);

    return new DataSource(
        buildMigratedDataSourceOptions(configOrString, {
            logging: false,
            driver: dataSourceConfig.type === "sqlite" ? SqliteDriver : undefined,
        }),
    );
}

export async function initializeDataSource(
    dataSource: DataSource,
): Promise<DataSource> {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
        const type = dataSource.options.type;
        if (type === "sqlite" || type === "better-sqlite3") {
            await dataSource.query("PRAGMA journal_mode = WAL;");
            await dataSource.query("PRAGMA busy_timeout = 30000;");
        }
    }
    return dataSource;
}
