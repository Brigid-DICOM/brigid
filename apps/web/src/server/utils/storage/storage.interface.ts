import type { Readable } from "node:stream";
import type { MultipartFile } from "@/server/types/file";

export interface DownloadResult {
    body: Readable;
    size?: number;
}

type UploadFileResult = {
    key: string;
    filePath: string;
    [key: string]: any;
};

export interface StorageProvider {
    uploadFile(
        file: MultipartFile,
        key: string
    ): Promise<UploadFileResult>;

    abortUpload(key: string): Promise<void>;

    downloadFile(key: string): Promise<DownloadResult>;

    deleteFile(key: string): Promise<void>;

    deleteFiles(keys: string[]): Promise<void>;
}