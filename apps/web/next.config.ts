import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    outputFileTracingIncludes: {
        "*": [
            "public/**/*",
            ".next/static/**/*",
        ]
    },
    transpilePackages: ["@brigid/database", "@brigid/env", "@electric-sql/pglite"],
    serverExternalPackages: ["raccoon-dcm4che-bridge", "hasha", "7zip-min"],
    experimental: {
        serverSourceMaps: true
    }
};

export default nextConfig;
