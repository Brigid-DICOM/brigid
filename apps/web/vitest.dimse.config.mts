import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "vitest/config";

dotenv.config({
    path: path.resolve(__dirname, ".env.test"),
});

export default defineConfig({
    test: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        setupFiles: [path.resolve(__dirname, "./tests/dimse/setup.ts")],
        environment: "node",
        globals: true,
        include: ["tests/dimse/**/*.test.ts"],
        fileParallelism: false,
    },
});
