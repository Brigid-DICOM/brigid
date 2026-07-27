import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({
    path: path.resolve(__dirname, ".env.test"),
});

if (process.env.STORAGE_LOCAL_DIR && !path.isAbsolute(process.env.STORAGE_LOCAL_DIR)) {
    process.env.STORAGE_LOCAL_DIR = path.resolve(
        __dirname,
        process.env.STORAGE_LOCAL_DIR,
    );
}

export default defineConfig({
    test: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        setupFiles: [path.resolve(__dirname, "./tests/dimse/setup.ts")],
        environment: "node",
        globals: true,
        include: [
            "tests/dimse/cstore*.test.ts",
            "tests/dimse/cfind*.test.ts",
            "tests/dimse/cmove*.test.ts",
            "tests/dimse/presentationContext.test.ts",
        ],
        fileParallelism: false,
        testTimeout: 120_000,
        hookTimeout: 120_000,
    },
});
