import fs from "node:fs";
import path from "node:path";

const serverJsPath = path.join(
    process.cwd(),
    ".next",
    "standalone",
    "apps",
    "web",
    "server.js",
);

try {
    if (!fs.existsSync(serverJsPath)) {
        console.warn(`⚠️ server.js not found at ${serverJsPath}`);
        process.exit(1);
    }

    // 讀取現有的 server.js
    const originalContent = fs.readFileSync(serverJsPath, "utf-8");

    // 在最上頭加入 dotenv 設置
    const dotenvSetup = `// Load environment variables from .env file
require('dotenv').config();

`;

    // 組合新內容
    const newContent = dotenvSetup + originalContent;

    // 寫回檔案
    fs.writeFileSync(serverJsPath, newContent, "utf-8");

    console.log("✅ Successfully added dotenv setup to standalone server.js");
} catch (error) {
    console.error("❌ Failed to modify server.js:", error);
}
