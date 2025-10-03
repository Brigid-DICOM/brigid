import { join } from "node:path";
import { app } from "electron";

export const mainDir = join(__dirname);

export const preloadDir = join(mainDir, "../preload");

export const resourcesDir = join(mainDir, '../../resources');

export const buildDir = join(mainDir, '../../build');

const appPath = app.getAppPath();

export const nextStandaloneDir = join(appPath, "dist", "next");

export const userDataDir = app.getPath("userData");

export const appStorageDir = join(userDataDir, "brigid-storage");

export const DB_SCHEMA_HASH_FILENAME = "brigid-local-db-schema-hash";

export const LOCAL_DATABASE_DIR = "brigid-local-db";

export const LOCAL_STORAGE_URL_PREFIX = "/brigid-desktop-files";
