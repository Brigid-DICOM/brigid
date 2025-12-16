import { createReadStream } from "node:fs";
import type { Readable } from "node:stream";
import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import env from "@brigid/env";
import type { MultipartFile } from "@/server/types/file";
import { appLogger } from "../logger";
import type { DownloadResult, StorageProvider } from "./storage.interface";

const logger = appLogger.child({
    module: "S3StorageProvider",
});

export class S3StorageProvider implements StorageProvider {
    private readonly s3Client: S3Client;
    private uploadingFiles = new Map<string, Upload>();

    constructor() {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        this.s3Client = new S3Client({
            region: "auto",
            endpoint: env.S3_ENDPOINT,
            credentials: {
                accessKeyId: env.S3_ACCESS_KEY,
                secretAccessKey: env.S3_SECRET_KEY,
            },
        });
    }

    async uploadFile(file: MultipartFile, key: string) {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        const fileStream = createReadStream(file.filename);

        const parallelUpload = new Upload({
            client: this.s3Client,
            params: {
                Bucket: env.S3_BUCKET,
                Key: key,
                Body: fileStream,
                ContentType: file.mediaType,
            },
            leavePartsOnError: false,
        });

        parallelUpload.on("httpUploadProgress", (progress) => {
            const loaded = progress.loaded || 0;
            const total = progress.total || file.size;
            const percentage = Math.round((loaded / total) * 100);

            logger.info(
                `Uploaded ${loaded} bytes of ${total} bytes (${percentage}%)`,
            );
        });

        try {
            this.uploadingFiles.set(key, parallelUpload);

            await parallelUpload.done();

            return { key, filePath: file.filename };
        } catch (error) {
            if (this.uploadingFiles.has(key)) {
                this.uploadingFiles.get(key)?.abort();
                this.uploadingFiles.delete(key);
            }

            logger.error("Failed to upload file", error);
            throw error;
        }
    }

    async abortUpload(key: string) {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        if (this.uploadingFiles.has(key)) {
            this.uploadingFiles.get(key)?.abort();
            this.uploadingFiles.delete(key);
        }
    }

    async downloadFile(key: string): Promise<DownloadResult> {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        const command = new GetObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: key,
        });

        const response = await this.s3Client.send(command);

        if (!response.Body) {
            throw new Error(`Can not download file: ${key}`);
        }

        return {
            body: response.Body as Readable,
            size: response.ContentLength,
        };
    }

    async deleteFile(key: string) {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        const command = new DeleteObjectCommand({
            Bucket: env.S3_BUCKET,
            Key: key,
        });

        try {
            await this.s3Client.send(command);
        } catch (error) {
            logger.error("Failed to delete file", error);
            throw error;
        }
    }

    async deleteFiles(keys: string[]) {
        if (env.STORAGE_PROVIDER !== "s3") {
            throw new Error("STORAGE_PROVIDER is not set to s3");
        }

        const deleteCommand = new DeleteObjectsCommand({
            Bucket: env.S3_BUCKET,
            Delete: {
                Objects: keys.map((key) => ({ Key: key })),
            },
        });

        try {
            await this.s3Client.send(deleteCommand);
        } catch (error) {
            logger.error("Failed to delete files in batch", error);
            throw error;
        }
    }
}
