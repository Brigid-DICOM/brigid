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
    serverExternalPackages: ["raccoon-dcm4che-bridge", "hasha", "7zip-min", "typeorm", "@brigid/database", "java-bridge"],
    experimental: {
        serverMinification: true,
        turbopackMinify: false
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
                        { key: "Access-Control-Allow-Methods", value: "GET, HEAD, PUT, POST, DELETE, PATCH, OPTIONS" },
                        { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
                        { key: "Access-Control-Allow-Credentials", value: "true" },
                    ]
                }
            ]
        }
        return [];
    }
};

export default nextConfig;
