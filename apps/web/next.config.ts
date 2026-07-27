import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    // monorepo 需將 tracing root 設為 repo 根目錄，否則根目錄 node_modules 不會被納入 standalone
    outputFileTracingRoot: path.join(__dirname, "../../"),
    outputFileTracingIncludes: {
        "/api/**/*": [
            "../../node_modules/java-bridge/**",
            "../../node_modules/raccoon-dcm4che-bridge/**",
            "../../node_modules/@imagemagick/magick-wasm/**",
        ],
        "*": [
            "public/**/*",
            ".next/static/**/*",
            "./node_modules/dotenv/**",
            "../../node_modules/dotenv/**",
        ],
    },
    transpilePackages: ["@brigid/env", "@electric-sql/pglite"],
    serverExternalPackages: [
        "raccoon-dcm4che-bridge",
        "hasha",
        "7zip-min",
        "typeorm",
        "@brigid/database",
        "java-bridge",
    ],
    // Turbopack 會將 node: 協定寫入 chunk 檔名，Windows NTFS 不允許冒號導致 standalone copyfile 失敗
    turbopack: {
        resolveAlias: {
            "node:fs/promises": "fs/promises",
        },
    },
    experimental: {
        serverMinification: true,
        turbopackMinify: false,
    },
    async headers() {
        if (process.env.NODE_ENV === "development") {
            return [
                {
                    // matching all API routes
                    source: "/api/:path*",
                    headers: [
                        // other headers omitted for brevity...
                        { key: "Access-Control-Allow-Origin", value: "*" },
                        {
                            key: "Access-Control-Allow-Methods",
                            value: "GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS",
                        },
                        {
                            key: "Access-Control-Allow-Headers",
                            value: "Content-Type, Authorization",
                        },
                        {
                            key: "Access-Control-Allow-Credentials",
                            value: "true",
                        },
                    ],
                },
            ];
        }
        return [];
    },
};

export default nextConfig;
