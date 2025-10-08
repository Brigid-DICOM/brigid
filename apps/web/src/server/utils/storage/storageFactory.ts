import env from "@brigid/env";
import { LocalStorageProvider } from "./localStorageProvider";
import type { StorageProvider } from "./storage.interface";

export const getStorageProvider = (): StorageProvider => {
    switch (env.STORAGE_PROVIDER) {
        case "local":
            return new LocalStorageProvider();
        default:
            throw new Error("Invalid storage provider");
    }
}