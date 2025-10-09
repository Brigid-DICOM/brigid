import { createReadStream, createWriteStream, promises as fsPromise } from "node:fs";
import { dirname, join } from "node:path";
import type { Readable } from "node:stream";
import env from "@brigid/env";
import type { MultipartFile } from "@/server/types/file";
import { appLogger } from "../logger";
import type { StorageProvider } from "./storage.interface";

const logger = appLogger.child({
    module: "LocalStorageProvider"
});

export class LocalStorageProvider implements StorageProvider {
    private readonly storageDir: string;
    private uploadingFiles = new Map<string, Readable>();

    constructor() {
        if (env.STORAGE_PROVIDER !== "local") {
            throw new Error("STORAGE_PROVIDER is not set to local");
        }

        this.storageDir = env.STORAGE_LOCAL_DIR;
        this.ensureStorageDir();
    }

    private async ensureStorageDir() {
        try {
            await fsPromise.mkdir(this.storageDir, { recursive: true });
        } catch(error) {
            console.error("Failed to ensure storage directory", error);
            throw error;
        }
    }

    private async getFilePath(key: string) {
        return join(this.storageDir, key);
    }

    async uploadFile(file: MultipartFile, key: string) {
        const filePath = await this.getFilePath(key);
        const fileDir = dirname(filePath);

        await fsPromise.mkdir(fileDir, { recursive: true });

        const readableStream = createReadStream(file.filename);
        this.uploadingFiles.set(key, readableStream);

        try {

            const writeStream = createWriteStream(filePath);
            readableStream.pipe(writeStream);
            logger.info(`upload ${file.filename} to ${filePath} successfully`);

            this.uploadingFiles.delete(key);

            return { key, filePath };
        } catch(error) {
            console.error("Failed to upload file", error);
            throw error;
        }
    }

    async abortUpload(key: string) {
        if (this.uploadingFiles.has(key)) {
            this.uploadingFiles.get(key)?.destroy();
            this.uploadingFiles.delete(key);

            const filePath = await this.getFilePath(key);

            try {
                await fsPromise.unlink(filePath);
                logger.info(`Aborted upload and deleted file: ${filePath}`);
            } catch(error) {
                logger.error("Failed to delete file", error);
                throw error;
            }
        }
    }

    async downloadFile(key: string) {
        const filePath = await this.getFilePath(key);

        try {
            const stats = await fsPromise.stat(filePath);
            const readStream = createReadStream(filePath);

            return {
                body: readStream,
                size: stats.size
            };
        } catch(error) {
            logger.error("Failed to download file", error);
            throw error;
        }
    }

    async deleteFile(key: string) {
        const filePath = await this.getFilePath(key);

        try {
            await fsPromise.unlink(filePath);
            logger.info(`Delete file successfully: ${filePath}`);
        } catch(error) {
            logger.error("Failed to delete file", error);
            throw error;
        }
    }

    async deleteFiles(keys: string[]) {
        const deletePromises = keys.map(async (key) => {
            try {
                await this.deleteFile(key);
            } catch(error) {
                logger.error("Failed to delete file in batch", error);
            }
        });

        await Promise.allSettled(deletePromises);
    }
}