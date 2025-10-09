import env from "@brigid/env";
import { LocalStorageProvider } from "./localStorageProvider";
import { S3StorageProvider } from "./s3StorageProvider";
import type { StorageProvider } from "./storage.interface";

export const getStorageProvider = (): StorageProvider => {
    switch (env.STORAGE_PROVIDER) {
        case "local":
            return new LocalStorageProvider();
        case "s3":
            return new S3StorageProvider();
        default:
            throw new Error("Invalid storage provider");
    }
}