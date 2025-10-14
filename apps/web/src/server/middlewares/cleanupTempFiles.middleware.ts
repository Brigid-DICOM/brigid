import fsE from "fs-extra";
import { createMiddleware } from "hono/factory";
import { setTimeout as delay } from "timers/promises";
import { appLogger } from "../utils/logger";

const logger = appLogger.child({
    module: "CleanupTempFilesMiddleware"
});

async function deleteWithRetry(filePath: string, maxRetries: number = 10) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await fsE.remove(filePath);
            logger.info(`Deleted tempfile successfully: ${filePath}`);
            return;
        } catch {
            await delay(300 + i * 300);
        }
    }
}

export const cleanupTempFiles = createMiddleware(async (c, next) => {
    await next();

    const tempFiles = c.get("tempFiles") as string[] | undefined;
    if (!tempFiles?.length) return;

    setImmediate(() => {
        void Promise.allSettled(
            tempFiles.map((filePath) => deleteWithRetry(filePath)),
        );
    });
});
