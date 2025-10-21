import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    outputFileTracingIncludes: {
        "/api/**/*": [
            "../../node_modules/java-bridge/**",
            "../../node_modules/raccoon-dcm4che-bridge/**",
        ],
        "*": [
            "public/**/*",
            ".next/static/**/*",
        ]
    },
    transpilePackages: ["@brigid/env", "@electric-sql/pglite"],
    serverExternalPackages: ["raccoon-dcm4che-bridge", "hasha", "7zip-min", "typeorm", "@brigid/database"],
    experimental: {
        serverMinification: true,
        turbopackMinify: false
    },
};

export default nextConfig;
