import type { Readable } from "node:stream";
import type { MultipartFile } from "@/server/types/file";

export interface DownloadResult {
    body: Readable;
    size?: number;
}

export interface StorageProvider {
    uploadFile(
        file: MultipartFile,
        key: string
    ): Promise<unknown>;

    abortUpload(key: string): Promise<void>;

    downloadFile(key: string): Promise<DownloadResult>;

    deleteFile(key: string): Promise<void>;

    deleteFiles(keys: string[]): Promise<void>;
}