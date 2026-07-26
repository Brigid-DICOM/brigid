import env from "@brigid/env";

export function getStorageLocalDir(): string {
    if (env.STORAGE_PROVIDER !== "local") {
        throw new Error("STORAGE_PROVIDER must be local for dimse e2e tests");
    }

    return env.STORAGE_LOCAL_DIR;
}
