import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        },
        setupFiles: [
            path.resolve(__dirname, "./tests/backend/setup.ts")
        ],
        environment: "node",
        globals: true,
        include: [
            "tests/backend/**/*.test.ts"
        ]
    }
});

