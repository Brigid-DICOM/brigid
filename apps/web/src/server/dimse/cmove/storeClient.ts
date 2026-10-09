import { randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import dcmjsDimse from "dcmjs-dimse";
import { getStorageProvider } from "../../utils/storage/storageFactory";

const { Client, constants, requests } = dcmjsDimse;
const { CStoreRequest } = requests;
const { Status } = constants;

export interface StoreInstanceResponse {
    status: number;
}

async function downloadInstanceToTempFile(
    instance: InstanceEntity,
): Promise<string> {
    const storage = getStorageProvider();
    const tempFile = join(tmpdir(), `brigid-cmove-${randomUUID()}.dcm`);
    const { body } = await storage.downloadFile(instance.instancePath);
    await pipeline(body, createWriteStream(tempFile));
    return tempFile;
}

export async function storeInstancesToDestination(options: {
    instances: InstanceEntity[];
    host: string;
    port: number;
    callingAeTitle: string;
    calledAeTitle: string;
    onStoreResponse: (result: StoreInstanceResponse) => void;
}): Promise<void> {
    if (options.instances.length === 0) {
        return;
    }

    const client = new Client();
    const tempFiles: string[] = [];

    try {
        for (const instance of options.instances) {
            const tempFile = await downloadInstanceToTempFile(instance);
            tempFiles.push(tempFile);
            const cStoreRequest = new CStoreRequest(tempFile);
            cStoreRequest.on("response", (cStoreResponse) => {
                options.onStoreResponse({
                    status: cStoreResponse.getStatus(),
                });
            });
            client.addRequest(cStoreRequest);
        }

        await new Promise<void>((resolve, reject) => {
            client.on("closed", () => resolve());
            client.on("networkError", reject);
            client.send(
                options.host,
                options.port,
                options.callingAeTitle,
                options.calledAeTitle,
            );
        });
    } finally {
        const fs = await import("node:fs/promises");
        await Promise.all(
            tempFiles.map(async (tempFile) => {
                await fs.unlink(tempFile).catch(() => undefined);
            }),
        );
    }
}
