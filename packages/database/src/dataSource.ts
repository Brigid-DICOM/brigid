import "reflect-metadata";
import env from "@brigid/env";
import { DataSource } from "typeorm";
import { initializeDataSource } from "./createMigratedDataSource";
import { buildMigratedDataSourceOptions } from "./dataSourceOptions";

export const AppDataSource = new DataSource(
    buildMigratedDataSourceOptions(env.TYPEORM_CONNECTION),
);

export async function initializeDb() {
    const dataSource = await initializeDataSource(AppDataSource);
    const type = dataSource.options.type;
    if (type === "sqlite" || type === "better-sqlite3") {
        console.log("SQLite Optimized in initializeDb");
    }
    return dataSource;
}

export { createMigratedDataSource, initializeDataSource } from "./createMigratedDataSource";
