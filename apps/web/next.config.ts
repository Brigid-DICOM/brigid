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
    serverExternalPackages: ["raccoon-dcm4che-bridge"],
    experimental: {
        serverSourceMaps: true
    }
};

export default nextConfig;
