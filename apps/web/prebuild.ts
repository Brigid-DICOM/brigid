import fs from "node:fs";
import path from "node:path";

try {
    const envPath = path.join(process.cwd(), ".env");
    const envExamplePath = path.join(process.cwd(), ".env.example");

    if (!fs.existsSync(envPath)) {
        console.warn("⚠️ .env file not found, copying from .env.example");
        fs.copyFileSync(envExamplePath, envPath);
    }
} catch (error) {
    console.error("❌ Failed to copy .env file", error);
}
