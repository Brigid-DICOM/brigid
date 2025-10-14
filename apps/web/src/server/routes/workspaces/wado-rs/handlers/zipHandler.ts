import { randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { dirname, join } from "node:path";
import { pipeline } from "node:stream/promises";
import type { InstanceEntity } from "@brigid/database/src/entities/instance.entity";
import fsE from "fs-extra";
import type { Context } from "hono";
import tmp from "tmp";
import { SevenZip } from "@/server/utils/7zip/sevenZip";
import { createHash } from "@/server/utils/createHash";
import { appLogger } from "@/server/utils/logger";
import { getStorageProvider } from "@/server/utils/storage/storageFactory";
import type { WadoResponseHandler } from "./wadoResponseHandler.interface";

const logger = appLogger.child({
    module: "ZipHandler"
});

export class ZipHandler implements WadoResponseHandler {
    canHandle(accept: string) {
        return accept.includes("application/zip");
    }

    async handle(c: Context, args: { instances: InstanceEntity[]; accept: string }) {
        const { instances } = args;

        const keys = instances.map(instance => instance.instancePath);
        if (!keys.every(key => key) || keys.length === 0) {
            return c.json(
                {
                    message: "Instance paths not found"
                },
                404
            );
        }

        const id = randomUUID();
        const workDir = join(tmp.dirSync().name, id);
        const zipTempFile = join(tmp.dirSync().name
        , `${id}.zip`);

        const storage = getStorageProvider();

        for (const instance of instances) {
            const key = instance.instancePath;
            if (!key) continue;

            const rel = join(
                createHash(instance.studyInstanceUid),
                createHash(instance.seriesInstanceUid),
                createHash(instance.sopInstanceUid)
            );

            const destFile = join(workDir, rel);
            const destFileDir = dirname(destFile);
            await fsE.ensureDir(destFileDir);

            const { body } = await storage.downloadFile(key);
            await pipeline(body, createWriteStream(destFile));
        }

        const sevenZip = new SevenZip("zip", workDir, zipTempFile);
        sevenZip.recursive().overwrite("s");

        await sevenZip.pack();

        const zipStream = createReadStream(zipTempFile);
        const headers = new Headers();
        headers.set("Content-Type", "application/zip");

        const zipFile = instances.length === 1 ? `${instances[0].sopInstanceUid}.zip` : `${instances[0].studyInstanceUid}.zip`;
        headers.set("Content-Disposition", `attachment; filename="${zipFile}"`);

        zipStream.once("close", async () => {
            await fsE.remove(workDir);
            logger.info(`Deleted zip temp work directory successfully: ${workDir}`);
        });

        // @ts-expect-error
        return new Response(zipStream, { status: 200, headers });
    }
}