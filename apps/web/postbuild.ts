import fs from "node:fs";
import path from "node:path";

const standaloneDir = path.join(process.cwd(), ".next", "standalone");
const serverJsPath = path.join(standaloneDir, "apps", "web", "server.js");

function resolveDotenvPackageDir(): string | undefined {
    const candidates = [
        path.join(process.cwd(), "node_modules", "dotenv"),
        path.join(process.cwd(), "..", "..", "node_modules", "dotenv"),
    ];

    return candidates.find((candidate) =>
        fs.existsSync(path.join(candidate, "lib", "main.js")),
    );
}

function copyDotenvToStandalone(): void {
    const dotenvSrc = resolveDotenvPackageDir();
    if (!dotenvSrc) {
        console.warn("⚠️ dotenv package not found, skipping copy to standalone");
        return;
    }

    const dotenvDest = path.join(standaloneDir, "node_modules", "dotenv");
    fs.mkdirSync(path.dirname(dotenvDest), { recursive: true });
    fs.cpSync(dotenvSrc, dotenvDest, { recursive: true });
    console.log(`✅ Copied dotenv from ${dotenvSrc} to standalone`);
}

try {
    if (!fs.existsSync(serverJsPath)) {
        console.warn(`⚠️ server.js not found at ${serverJsPath}`);
        process.exit(1);
    }

    // postbuild 注入的 require 不會被 next build trace，需手動複製實體檔案
    copyDotenvToStandalone();

    const originalContent = fs.readFileSync(serverJsPath, "utf-8");

    const dotenvSetup = `
const { createRequire } = require('node:module');
require = createRequire(__filename);
require('dotenv').config();

`;

    fs.writeFileSync(serverJsPath, dotenvSetup + originalContent, "utf-8");
    console.log("✅ Successfully added dotenv setup to standalone server.js");
} catch (error) {
    console.error("❌ Failed to modify server.js:", error);
    process.exit(1);
}
